#!/usr/bin/env bash
# ── Reklame-studio: ett-klikks lokal server (Mac / Linux) ──
cd "$(dirname "$0")"
PORT=8765

echo
echo "  Starter reklame-studio på http://localhost:$PORT"
echo "  La dette vinduet stå åpent mens du jobber."
echo "  Trykk Ctrl+C for å stoppe."
echo

# Åpne nettleser etter litt
( sleep 1.5
  if command -v open >/dev/null;    then open "http://localhost:$PORT/index.html"
  elif command -v xdg-open >/dev/null; then xdg-open "http://localhost:$PORT/index.html"
  fi ) &

if command -v python3 >/dev/null; then
  exec python3 -m http.server "$PORT"
elif command -v python >/dev/null; then
  exec python -m http.server "$PORT"
elif command -v node >/dev/null; then
  exec npx --yes http-server -p "$PORT" -c-1
else
  echo "  Fant ikke Python eller Node. Installer en av dem først."
  exit 1
fi
