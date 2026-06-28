// Direction registry. Only REAL, fully-implemented directions live here — no
// fake fallback slots that alias back to a handful of looks (that was the root
// cause of "every brand looks the same"). Adding a direction = importing it and
// adding it to ALL_DIRECTIONS.

import type { ArtDirection } from "./types";
import { swiss } from "./swiss";
import { cinematic } from "./cinematic";
import { editorial } from "./editorial";

export const ALL_DIRECTIONS: ReadonlyArray<ArtDirection> = [
  swiss,
  cinematic,
  editorial,
  // TODO (next drops): brutalist, cyber, risograph, kinetic-type, aurora,
  // minimal-jp, data-viz, punk, retro-future.
];

export function directionById(id: string): ArtDirection | undefined {
  return ALL_DIRECTIONS.find((d) => d.id === id);
}

export { swiss, cinematic, editorial };
export type { ArtDirection, Archetype, SceneCfg, SceneCtx, Brand, ImageTreatment } from "./types";
