"""
Claude AI Blender Integration
Install: Edit > Preferences > Add-ons > Install > velg denne filen > aktiver
Bruk: N-panel i 3D Viewport > Claude AI
Krever: pip install anthropic  (i Blender sin Python)
"""

bl_info = {
    "name": "Claude AI Assistant",
    "author": "Claude Integration",
    "version": (1, 0, 0),
    "blender": (3, 0, 0),
    "location": "View3D > Sidebar > Claude AI",
    "description": "Chat med Claude AI og la den utføre handlinger i Blender",
    "category": "Interface",
}

import bpy
import json
import threading
import sys
import subprocess
import textwrap
from bpy.props import StringProperty, CollectionProperty
from bpy.types import Panel, Operator, PropertyGroup, AddonPreferences


# ---------------------------------------------------------------------------
# Hjelpefunksjoner
# ---------------------------------------------------------------------------

def ensure_anthropic():
    """Installer anthropic-pakken i Blender sin Python hvis den mangler."""
    try:
        import anthropic
        return True, anthropic
    except ImportError:
        python = sys.executable
        try:
            subprocess.check_call([python, "-m", "pip", "install", "anthropic", "--quiet"])
            import anthropic
            return True, anthropic
        except Exception as e:
            return False, str(e)


def get_scene_context():
    """Returner en kort tekstbeskrivelse av gjeldende scene."""
    scene = bpy.context.scene
    objects = [obj.name for obj in scene.objects]
    selected = [obj.name for obj in bpy.context.selected_objects]
    active = bpy.context.active_object.name if bpy.context.active_object else "None"
    return (
        f"Scene: '{scene.name}' | "
        f"Objects ({len(objects)}): {', '.join(objects[:10])}{'...' if len(objects) > 10 else ''} | "
        f"Selected: {selected} | Active: {active}"
    )


def execute_blender_code(code: str) -> str:
    """Kjør Python-kode i Blender sitt miljø og returner resultat."""
    import io
    from contextlib import redirect_stdout, redirect_stderr

    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()
    result = {"output": "", "error": ""}

    def run():
        try:
            exec_globals = {"bpy": bpy, "__builtins__": __builtins__}
            with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                exec(compile(code, "<claude>", "exec"), exec_globals)
            result["output"] = stdout_capture.getvalue()
        except Exception as e:
            result["error"] = f"{type(e).__name__}: {e}"

    # Kjør på hovedtråden via timer hvis vi er på en bakgrunnstråd
    if threading.current_thread() is threading.main_thread():
        run()
    else:
        done = threading.Event()
        def main_thread_run():
            run()
            done.set()
            return None  # avregistrer timer
        bpy.app.timers.register(main_thread_run, first_interval=0.0)
        done.wait(timeout=30)

    if result["error"]:
        return f"FEIL: {result['error']}"
    return result["output"] or "OK (ingen output)"


TOOLS = [
    {
        "name": "execute_python",
        "description": (
            "Kjør Python-kode i Blender sitt bpy-miljø. "
            "Bruk dette til å opprette/endre objekter, sette materialer, animere, "
            "endre innstillinger osv. bpy er allerede importert. "
            "Print resultater du vil vise brukeren."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string",
                    "description": "Gyldig Python/bpy-kode som skal kjøres i Blender",
                }
            },
            "required": ["code"],
        },
    },
    {
        "name": "get_scene_info",
        "description": "Hent detaljert informasjon om gjeldende scene, objekter og valg.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
]

SYSTEM_PROMPT = """Du er en Blender 3D-assistent som kan utføre handlinger direkte i Blender.
Du har tilgang til verktøy for å kjøre Python/bpy-kode og hente sceneinformasjon.

Retningslinjer:
- Svar alltid på norsk med mindre brukeren skriver på et annet språk
- Når brukeren ber deg gjøre noe i Blender, bruk execute_python-verktøyet
- Forklar kort hva du gjør og resultatet
- Hvis kode feiler, forsøk å rette og kjør igjen
- Hold koden enkel og lesbar
- Bruk print() for å vise resultater til brukeren"""


# ---------------------------------------------------------------------------
# Addon-innstillinger
# ---------------------------------------------------------------------------

class ClaudeAddonPreferences(AddonPreferences):
    bl_idname = __name__

    api_key: StringProperty(
        name="Anthropic API-nøkkel",
        description="Din Anthropic API-nøkkel (sk-ant-...)",
        subtype="PASSWORD",
        default="",
    )

    def draw(self, context):
        layout = self.layout
        layout.prop(self, "api_key")
        layout.label(text="Hent API-nøkkel fra console.anthropic.com", icon="URL")


# ---------------------------------------------------------------------------
# Datastrukturer for meldingshistorikk
# ---------------------------------------------------------------------------

class ChatMessage(PropertyGroup):
    role: StringProperty(default="")
    content: StringProperty(default="")


# ---------------------------------------------------------------------------
# Operatorer
# ---------------------------------------------------------------------------

class CLAUDE_OT_SendMessage(Operator):
    bl_idname = "claude.send_message"
    bl_label = "Send"
    bl_description = "Send melding til Claude"

    def execute(self, context):
        props = context.scene.claude_props
        user_input = props.user_input.strip()
        if not user_input:
            self.report({"WARNING"}, "Skriv en melding først")
            return {"CANCELLED"}

        prefs = context.preferences.addons[__name__].preferences
        api_key = prefs.api_key.strip()
        if not api_key:
            self.report({"ERROR"}, "Legg til API-nøkkel i Innstillinger > Add-ons > Claude AI")
            return {"CANCELLED"}

        # Legg til brukermelding i historikk
        msg = props.messages.add()
        msg.role = "user"
        msg.content = user_input
        props.user_input = ""
        props.status = "Sender til Claude..."

        # Bygg meldingshistorikk for API
        history = []
        for m in props.messages:
            history.append({"role": m.role, "content": m.content})

        # Kjør i bakgrunnstråd for å ikke fryse UI
        thread = threading.Thread(
            target=self._call_claude,
            args=(context, api_key, history),
            daemon=True,
        )
        thread.start()
        return {"FINISHED"}

    def _call_claude(self, context, api_key, history):
        ok, anthropic_or_err = ensure_anthropic()
        if not ok:
            self._update_status(context, f"Feil ved installasjon av anthropic: {anthropic_or_err}")
            return

        anthropic = anthropic_or_err
        client = anthropic.Anthropic(api_key=api_key)

        # Agentic loop: fortsett til Claude er ferdig (ingen flere tool_use)
        messages = [{"role": m["role"], "content": m["content"]} for m in history]

        try:
            while True:
                response = client.messages.create(
                    model="claude-sonnet-4-6",
                    max_tokens=4096,
                    system=SYSTEM_PROMPT + f"\n\nGjeldende scene: {get_scene_context()}",
                    tools=TOOLS,
                    messages=messages,
                )

                # Legg til assistent-svar i meldingslisten
                messages.append({"role": "assistant", "content": response.content})

                if response.stop_reason == "end_turn":
                    # Hent tekstinnhold
                    text = " ".join(
                        block.text for block in response.content
                        if hasattr(block, "text")
                    )
                    self._append_assistant_message(context, text)
                    self._update_status(context, "")
                    break

                if response.stop_reason == "tool_use":
                    tool_results = []
                    for block in response.content:
                        if block.type != "tool_use":
                            continue

                        tool_name = block.name
                        tool_input = block.input

                        self._update_status(context, f"Kjører: {tool_name}...")

                        if tool_name == "execute_python":
                            result_text = execute_blender_code(tool_input.get("code", ""))
                        elif tool_name == "get_scene_info":
                            result_text = get_scene_context()
                        else:
                            result_text = f"Ukjent verktøy: {tool_name}"

                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result_text,
                        })

                    messages.append({"role": "user", "content": tool_results})
                else:
                    break

        except Exception as e:
            self._append_assistant_message(context, f"API-feil: {e}")
            self._update_status(context, "Feil – se melding over")

    def _append_assistant_message(self, context, text):
        def do():
            props = context.scene.claude_props
            msg = props.messages.add()
            msg.role = "assistant"
            msg.content = text
            return None
        if threading.current_thread() is threading.main_thread():
            do()
        else:
            bpy.app.timers.register(do, first_interval=0.05)

    def _update_status(self, context, text):
        def do():
            context.scene.claude_props.status = text
            for area in context.screen.areas:
                area.tag_redraw()
            return None
        if threading.current_thread() is threading.main_thread():
            do()
        else:
            bpy.app.timers.register(do, first_interval=0.05)


class CLAUDE_OT_ClearHistory(Operator):
    bl_idname = "claude.clear_history"
    bl_label = "Tøm samtale"
    bl_description = "Slett hele samtalehistorikken"

    def execute(self, context):
        context.scene.claude_props.messages.clear()
        context.scene.claude_props.status = ""
        return {"FINISHED"}


class CLAUDE_OT_InstallDeps(Operator):
    bl_idname = "claude.install_deps"
    bl_label = "Installer anthropic-pakke"
    bl_description = "Installer anthropic Python-pakke i Blender sin Python"

    def execute(self, context):
        ok, result = ensure_anthropic()
        if ok:
            self.report({"INFO"}, "anthropic er installert og klar")
        else:
            self.report({"ERROR"}, f"Installasjon feilet: {result}")
        return {"FINISHED"}


# ---------------------------------------------------------------------------
# Scene-egenskaper
# ---------------------------------------------------------------------------

class ClaudeProperties(PropertyGroup):
    user_input: StringProperty(
        name="",
        description="Skriv melding til Claude",
        default="",
    )
    status: StringProperty(default="")
    messages: CollectionProperty(type=ChatMessage)


# ---------------------------------------------------------------------------
# Panel
# ---------------------------------------------------------------------------

class CLAUDE_PT_MainPanel(Panel):
    bl_label = "Claude AI"
    bl_idname = "CLAUDE_PT_main"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Claude AI"

    def draw(self, context):
        layout = self.layout
        props = context.scene.claude_props
        prefs = context.preferences.addons[__name__].preferences

        # API-nøkkel status
        if not prefs.api_key:
            box = layout.box()
            box.label(text="API-nøkkel mangler!", icon="ERROR")
            box.label(text="Innstillinger > Add-ons > Claude AI")
            box.operator("claude.install_deps", icon="IMPORT")
            return

        # Samtalehistorikk
        if props.messages:
            box = layout.box()
            box.label(text="Samtale:", icon="CHAT")
            for msg in props.messages:
                row = box.row()
                if msg.role == "user":
                    row.label(text="Du:", icon="PERSON")
                else:
                    row.label(text="Claude:", icon="MODIFIER")
                # Wrap lange linjer
                max_chars = 50
                text = msg.content
                for i in range(0, min(len(text), 300), max_chars):
                    box.label(text=text[i:i + max_chars])
                if len(text) > 300:
                    box.label(text="[... se systemkonsoll for full tekst]")
                box.separator(factor=0.3)

        # Status
        if props.status:
            layout.label(text=props.status, icon="TIME")

        # Inndatafelt
        layout.label(text="Melding til Claude:")
        layout.prop(props, "user_input")

        row = layout.row(align=True)
        row.operator("claude.send_message", icon="PLAY")
        row.operator("claude.clear_history", icon="TRASH")

        layout.operator("claude.install_deps", icon="IMPORT", text="Sjekk/installer avhengigheter")


# ---------------------------------------------------------------------------
# Registrering
# ---------------------------------------------------------------------------

CLASSES = [
    ChatMessage,
    ClaudeAddonPreferences,
    ClaudeProperties,
    CLAUDE_OT_SendMessage,
    CLAUDE_OT_ClearHistory,
    CLAUDE_OT_InstallDeps,
    CLAUDE_PT_MainPanel,
]


def register():
    for cls in CLASSES:
        bpy.utils.register_class(cls)
    bpy.types.Scene.claude_props = bpy.props.PointerProperty(type=ClaudeProperties)


def unregister():
    for cls in reversed(CLASSES):
        bpy.utils.unregister_class(cls)
    del bpy.types.Scene.claude_props


if __name__ == "__main__":
    register()
