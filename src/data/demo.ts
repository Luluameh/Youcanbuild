import type {
  AccountMentorProfile,
  EarnedAchievement,
  LearnerProfile,
  ModuleProgress,
  User,
} from "@/types/index.ts";

/** Local demo accounts. Email is private and must not appear on mentor or public screens. */
export const demoLearnerUser: User = {
  id: "learner-ada",
  displayName: "Ada",
  email: "ada.demo@youcanbuild.local",
  role: "learner",
};

export const demoLearnerProfile: LearnerProfile = {
  userId: demoLearnerUser.id,
  displayName: demoLearnerUser.displayName,
  pathId: "frontend",
  experience: "some",
  goal: "projects",
  onboardingComplete: true,
};

export const demoMentorCatalogId = "mentor-amara";

export const demoMentorUser: User = {
  id: "mentor-user-amara",
  displayName: "Amara Okonkwo",
  email: "amara.demo@youcanbuild.local",
  role: "mentor",
};

export const demoMentorProfile: AccountMentorProfile = {
  userId: demoMentorUser.id,
  catalogMentorId: demoMentorCatalogId,
  displayName: demoMentorUser.displayName,
  expertise: ["Frontend Development", "JavaScript", "React", "TypeScript"],
  technologies: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
  bio: "Demo mentor account for hackathon walkthroughs. Helps learners with structured frontend guidance.",
  availability: "available",
  pathIds: ["frontend"],
  onboardingComplete: true,
  verification: "verified",
};

export const demoLearnerProgress: ModuleProgress[] = [
  { moduleId: "fe-internet", status: "completed", completedAt: "2026-09-04" },
  { moduleId: "fe-html", status: "completed", completedAt: "2026-09-12" },
  { moduleId: "fe-css", status: "completed", completedAt: "2026-09-26" },
  { moduleId: "fe-javascript", status: "current" },
];

export const demoEarnedAchievements: EarnedAchievement[] = [
  {
    achievementId: "html-foundations",
    earnedAt: "2026-09-12",
    verification: { status: "ready" },
  },
  {
    achievementId: "css-foundations",
    earnedAt: "2026-09-26",
    verification: { status: "ready" },
  },
];
