import { getModulesForPath } from "@/data/catalog.ts";
import type { LearningPathId, ModuleProgress } from "@/types/index.ts";

/** First module is current; the rest stay upcoming until the learner completes work. */
export function createInitialProgress(pathId: LearningPathId): ModuleProgress[] {
  const modules = getModulesForPath(pathId);
  const first = modules[0];
  if (!first) {
    return [];
  }
  return [{ moduleId: first.id, status: "current" }];
}
