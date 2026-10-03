import { getModulesForPath } from "@/data/catalog.ts";
import type { LearningPathId, ModuleProgress, ModuleStatus, RoadmapModule } from "@/types/index.ts";

export type RoadmapStep = RoadmapModule & {
  status: ModuleStatus;
};

export type ProgressSummary = {
  steps: RoadmapStep[];
  completed: number;
  total: number;
  percent: number;
  current?: RoadmapStep;
  next?: RoadmapStep;
};

function statusFor(moduleId: string, progress: readonly ModuleProgress[]): ModuleStatus {
  return progress.find((item) => item.moduleId === moduleId)?.status ?? "upcoming";
}

/**
 * Completed modules count fully. The current module counts halfway,
 * so a path that is underway does not read as zero.
 */
export function summarizeProgress(
  pathId: LearningPathId,
  progress: readonly ModuleProgress[],
): ProgressSummary {
  const steps: RoadmapStep[] = getModulesForPath(pathId).map((module) => ({
    ...module,
    status: statusFor(module.id, progress),
  }));

  const completed = steps.filter((step) => step.status === "completed").length;
  const currentIndex = steps.findIndex((step) => step.status === "current");
  const current = currentIndex >= 0 ? steps[currentIndex] : undefined;
  const next =
    currentIndex >= 0 && currentIndex + 1 < steps.length ? steps[currentIndex + 1] : undefined;

  const weighted = steps.reduce((total, step) => {
    if (step.status === "completed") {
      return total + 1;
    }
    if (step.status === "current") {
      return total + 0.5;
    }
    return total;
  }, 0);

  const percent = steps.length === 0 ? 0 : Math.round((weighted / steps.length) * 100);

  return {
    steps,
    completed,
    total: steps.length,
    percent,
    current,
    next,
  };
}
