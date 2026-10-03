import type { ExperienceLevel, LearningGoal, LearningPathId } from "@/types/index.ts";

export const experienceLabels: Record<ExperienceLevel, string> = {
  beginner: "Complete beginner",
  some: "I know a little",
  built: "I've built a few things",
};

export const goalLabels: Record<LearningGoal, string> = {
  skill: "Learn a new skill",
  projects: "Build projects",
  career: "Prepare for a career",
  explore: "Explore technology",
};

export const pathLabels: Record<LearningPathId, string> = {
  frontend: "Frontend Development",
  "ui-ux": "UI/UX Design",
  web3: "Web3 Development",
};
