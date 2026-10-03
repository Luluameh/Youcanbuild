import { learningPaths } from "@/data/learningPaths.ts";
import type { LearningPathId } from "@/types/index.ts";
import { Blocks, Code2, Palette, type LucideIcon } from "lucide-react";

export const pathIconMap: Record<LearningPathId, LucideIcon> = {
  frontend: Code2,
  "ui-ux": Palette,
  web3: Blocks,
};

export function getPathIcon(id: LearningPathId): LucideIcon {
  return pathIconMap[id];
}

export function orderedPaths() {
  return learningPaths;
}
