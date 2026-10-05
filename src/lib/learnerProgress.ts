import { getModule, getModulesForPath } from "@/data/catalog.ts";
import type {
  EarnedAchievement,
  LearningPathId,
  ModuleProgress,
  StellarVerification,
} from "@/types/index.ts";
import { summarizeProgress } from "@/lib/progress.ts";
import { defaultKnowledgeCheckState, normalizeKnowledgeCheck } from "@/lib/knowledgeCheck.ts";

export type CompleteModuleResult =
  | { ok: false; reason: string }
  | {
      ok: true;
      alreadyCompleted: boolean;
      achievementId?: string;
      nextModuleId?: string;
      pathComplete: boolean;
    };

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function hasAchievement(earned: readonly EarnedAchievement[], achievementId: string): boolean {
  return earned.some((item) => item.achievementId === achievementId);
}

/**
 * Keeps completed modules in path order and ensures at most one current module.
 * Rebuilds a safe current pointer when progress entries are inconsistent.
 */
export function normalizeModuleProgress(
  pathId: LearningPathId,
  progress: readonly ModuleProgress[],
): ModuleProgress[] {
  const modules = getModulesForPath(pathId);
  if (modules.length === 0) {
    return [];
  }

  const validIds = new Set(modules.map((module) => module.id));
  const byId = new Map(
    progress.filter((entry) => validIds.has(entry.moduleId)).map((entry) => [entry.moduleId, entry]),
  );

  const normalized: ModuleProgress[] = [];
  let assignedCurrent = false;

  for (const module of modules) {
    const entry = byId.get(module.id);
    if (entry?.status === "completed") {
      normalized.push({
        moduleId: module.id,
        status: "completed",
        completedAt: entry.completedAt ?? todayIsoDate(),
      });
      continue;
    }

    if (!assignedCurrent) {
      if (entry?.status === "current") {
        normalized.push({ moduleId: module.id, status: "current" });
        assignedCurrent = true;
        continue;
      }
      normalized.push({ moduleId: module.id, status: "current" });
      assignedCurrent = true;
    }
  }

  return normalized;
}

export function moduleBelongsToPath(pathId: LearningPathId, moduleId: string): boolean {
  const module = getModule(moduleId);
  return module?.pathId === pathId;
}

export function canCompleteModule(
  pathId: LearningPathId,
  moduleId: string,
  progress: readonly ModuleProgress[],
): boolean {
  if (!moduleBelongsToPath(pathId, moduleId)) {
    return false;
  }
  const summary = summarizeProgress(pathId, normalizeModuleProgress(pathId, progress));
  return summary.current?.id === moduleId;
}

export function applyModuleCompletion(
  pathId: LearningPathId,
  moduleId: string,
  progress: readonly ModuleProgress[],
  earnedAchievements: readonly EarnedAchievement[],
): {
  moduleProgress: ModuleProgress[];
  earnedAchievements: EarnedAchievement[];
  result: CompleteModuleResult;
} {
  if (!moduleBelongsToPath(pathId, moduleId)) {
    return {
      moduleProgress: [...progress],
      earnedAchievements: [...earnedAchievements],
      result: { ok: false, reason: "That module is not part of your learning path." },
    };
  }

  const normalized = normalizeModuleProgress(pathId, progress);
  const alreadyCompleted = normalized.some(
    (entry) => entry.moduleId === moduleId && entry.status === "completed",
  );

  if (alreadyCompleted) {
    return {
      moduleProgress: normalized,
      earnedAchievements: [...earnedAchievements],
      result: { ok: true, alreadyCompleted: true, pathComplete: !summarizeProgress(pathId, normalized).current },
    };
  }

  if (!canCompleteModule(pathId, moduleId, normalized)) {
    return {
      moduleProgress: normalized,
      earnedAchievements: [...earnedAchievements],
      result: {
        ok: false,
        reason: "You can complete your current module first. Upcoming modules unlock in order.",
      },
    };
  }

  const modules = getModulesForPath(pathId);
  const moduleIndex = modules.findIndex((module) => module.id === moduleId);
  const module = modules[moduleIndex];
  if (!module) {
    return {
      moduleProgress: normalized,
      earnedAchievements: [...earnedAchievements],
      result: { ok: false, reason: "Module not found." },
    };
  }

  const nextModule = modules[moduleIndex + 1];
  const completedAt = todayIsoDate();

  const completedEntries: ModuleProgress[] = [
    ...normalized.filter((entry) => entry.status === "completed"),
    { moduleId: module.id, status: "completed", completedAt },
  ];

  const draftProgress = nextModule
    ? [...completedEntries, { moduleId: nextModule.id, status: "current" as const }]
    : completedEntries;

  const repaired = normalizeModuleProgress(pathId, draftProgress);

  let nextEarned = [...earnedAchievements];
  let achievementId: string | undefined;

  if (module.achievementId && !hasAchievement(nextEarned, module.achievementId)) {
    const verification: StellarVerification = { status: "ready" };
    nextEarned = [
      ...nextEarned,
      {
        achievementId: module.achievementId,
        earnedAt: completedAt,
        verification,
        knowledgeCheck: defaultKnowledgeCheckState(),
      },
    ];
    achievementId = module.achievementId;
  }

  return {
    moduleProgress: repaired,
    earnedAchievements: nextEarned,
    result: {
      ok: true,
      alreadyCompleted: false,
      achievementId,
      nextModuleId: nextModule?.id,
      pathComplete: !nextModule,
    },
  };
}

export function countVerifiedAchievements(earned: readonly EarnedAchievement[]): number {
  return earned.filter((item) => item.verification.status === "verified").length;
}

function isVerifiedRecord(verification: StellarVerification): verification is Extract<
  StellarVerification,
  { status: "verified" }
> {
  return (
    verification.status === "verified" &&
    typeof verification.transactionHash === "string" &&
    verification.transactionHash.length > 0
  );
}

/** Ensures older localStorage records gain `ready` so Stellar verification UI can appear. */
export function normalizeEarnedAchievements(earned: readonly EarnedAchievement[]): EarnedAchievement[] {
  return earned.map((item) => {
    let next = item;
    const verification = item.verification;
    if (isVerifiedRecord(verification)) {
      next = { ...item, verification };
    } else if (verification?.status === "ready") {
      next = { ...item, verification: { status: "ready" as const } };
    } else {
      next = {
        ...item,
        verification: { status: "ready" as const },
      };
    }
    return normalizeKnowledgeCheck(next);
  });
}

export type AchievementUiStatus = "Earned" | "Ready to verify on Stellar" | "Verified on Stellar";

export function achievementUiStatus(verification: StellarVerification): AchievementUiStatus {
  if (verification.status === "verified") {
    return "Verified on Stellar";
  }
  if (verification.status === "ready") {
    return "Ready to verify on Stellar";
  }
  return "Earned";
}

export function achievementBadgeTone(
  status: AchievementUiStatus,
): "neutral" | "primary" | "success" {
  if (status === "Verified on Stellar") {
    return "success";
  }
  if (status === "Ready to verify on Stellar") {
    return "primary";
  }
  return "neutral";
}
