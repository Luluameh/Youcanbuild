import { achievements } from "@/data/achievements.ts";
import { learningPaths } from "@/data/learningPaths.ts";
import { mentors } from "@/data/mentors.ts";
import { modules } from "@/data/modules/index.ts";
import type { LearningPath, LearningPathId, MentorProfile, RoadmapModule } from "@/types/index.ts";

const modulesById = new Map(modules.map((module) => [module.id, module]));
const pathsById = new Map(learningPaths.map((path) => [path.id, path]));
const mentorsById = new Map(mentors.map((mentor) => [mentor.id, mentor]));
const achievementsById = new Map(achievements.map((achievement) => [achievement.id, achievement]));

export function getLearningPath(id: LearningPathId): LearningPath | undefined {
  return pathsById.get(id);
}

export function getModulesForPath(id: LearningPathId): RoadmapModule[] {
  return modules
    .filter((module) => module.pathId === id)
    .sort((left, right) => left.order - right.order);
}

export function getModule(id: string): RoadmapModule | undefined {
  return modulesById.get(id);
}

export function getMentor(id: string): MentorProfile | undefined {
  return mentorsById.get(id);
}

export function getMentorsForPath(id: LearningPathId): MentorProfile[] {
  return mentors.filter((mentor) => mentor.pathIds.includes(id));
}

export function getAchievement(id: string) {
  return achievementsById.get(id);
}

for (const path of learningPaths) {
  const actual = getModulesForPath(path.id).map((module) => module.id);
  if (actual.join("|") !== path.moduleIds.join("|")) {
    throw new Error(`Learning path "${path.id}" does not match its modules.`);
  }
}

for (const achievement of achievements) {
  const module = getModule(achievement.moduleId);
  if (!module || module.achievementId !== achievement.id || module.pathId !== achievement.pathId) {
    throw new Error(`Achievement "${achievement.id}" is not linked from its module.`);
  }
}

export { achievements, learningPaths, mentors, modules };
