import { getKnowledgeCheckForAchievement } from "@/data/knowledgeChecks.ts";
import type { EarnedAchievement, KnowledgeCheckResult } from "@/types/index.ts";

export function knowledgeCheckRequired(earned: EarnedAchievement): boolean {
  return earned.knowledgeCheck?.status !== "passed";
}

export function hasPassedKnowledgeCheck(earned: EarnedAchievement): boolean {
  return earned.knowledgeCheck?.status === "passed";
}

export function defaultKnowledgeCheckState(): KnowledgeCheckResult {
  return { status: "required" };
}

export type GradeKnowledgeCheckInput = Record<string, string>;

export type GradeKnowledgeCheckResult =
  | { ok: true; score: number; total: number; passedAt: string }
  | { ok: false; score: number; total: number; passAt: number; missed: string[] };

export function gradeKnowledgeCheck(
  achievementId: string,
  answers: GradeKnowledgeCheckInput,
): GradeKnowledgeCheckResult {
  const check = getKnowledgeCheckForAchievement(achievementId);
  if (!check) {
    return {
      ok: true,
      score: 0,
      total: 0,
      passedAt: new Date().toISOString().slice(0, 10),
    };
  }

  const missed: string[] = [];
  let score = 0;

  for (const question of check.questions) {
    const picked = answers[question.id];
    if (picked === question.answerId) {
      score += 1;
    } else {
      missed.push(question.prompt);
    }
  }

  const total = check.questions.length;
  if (score >= check.passAt) {
    return { ok: true, score, total, passedAt: new Date().toISOString().slice(0, 10) };
  }

  return { ok: false, score, total, passAt: check.passAt, missed };
}

export function normalizeKnowledgeCheck(earned: EarnedAchievement): EarnedAchievement {
  if (earned.knowledgeCheck?.status === "passed") {
    return earned;
  }
  if (earned.verification.status === "verified") {
    return {
      ...earned,
      knowledgeCheck: earned.knowledgeCheck ?? {
        status: "passed",
        passedAt: earned.verification.recordedAt,
        score: 0,
        total: 0,
      },
    };
  }
  return {
    ...earned,
    knowledgeCheck: earned.knowledgeCheck ?? defaultKnowledgeCheckState(),
  };
}
