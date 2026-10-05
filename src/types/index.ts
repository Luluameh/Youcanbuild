export type UserRole = "learner" | "mentor";

export type ExperienceLevel = "beginner" | "some" | "built";

export type LearningGoal = "skill" | "projects" | "career" | "explore";

export type LearningPathId = "frontend" | "ui-ux" | "web3";

export type ModuleStatus = "completed" | "current" | "upcoming";

export type MentorshipStatus = "pending" | "accepted" | "completed" | "declined";

export type MentorVerification = "verified" | "pending";

export type MentorAvailability = "available" | "limited" | "unavailable";

export type ResourceKind = "documentation" | "tutorial" | "video" | "article";

export type StellarNetwork = "testnet";

/**
 * Private account record. Email stays off public pages, mentor views, and the ledger.
 */
export type User = {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
};

export type LearnerProfile = {
  userId: string;
  displayName: string;
  pathId: LearningPathId | null;
  experience: ExperienceLevel;
  goal: LearningGoal;
  onboardingComplete: boolean;
};

export type MentorSocialLinks = {
  github?: string;
  linkedIn?: string;
  /** X (Twitter) profile URL */
  twitter?: string;
  website?: string;
};

export type MentorProfile = {
  id: string;
  displayName: string;
  headline: string;
  expertise: string[];
  technologies: string[];
  bio: string;
  verification: MentorVerification;
  availability: MentorAvailability;
  pathIds: LearningPathId[];
  /** Optional profile photo for the public directory */
  avatarSrc?: string;
  /** Public links learners can review before requesting guidance */
  social?: MentorSocialLinks;
};

/** Mentor account data for signed-in users (not the public directory). */
export type AccountMentorProfile = {
  userId: string;
  displayName: string;
  expertise: string[];
  technologies: string[];
  bio: string;
  availability: MentorAvailability;
  pathIds: LearningPathId[];
  onboardingComplete: boolean;
  /** Demo verification status for the hackathon MVP, not Stellar identity proof. */
  verification: MentorVerification;
  /** Links a signed-in mentor account to a public directory profile when applicable. */
  catalogMentorId?: string;
};

export type LearnerState = {
  profile: LearnerProfile;
  moduleProgress: ModuleProgress[];
  earnedAchievements: EarnedAchievement[];
};

/** Local demo account record. Passwords are mock credentials for hackathon use only. */
export type StoredAccount = {
  user: User;
  password: string;
  learner?: LearnerState;
  mentor?: AccountMentorProfile;
};

export type LearningPath = {
  id: LearningPathId;
  title: string;
  description: string;
  estimatedDuration: string;
  sampleTopics: string[];
  moduleIds: string[];
};

export type Resource = {
  id: string;
  title: string;
  kind: ResourceKind;
  url: string;
  source: string;
};

export type RoadmapModule = {
  id: string;
  pathId: LearningPathId;
  order: number;
  title: string;
  description: string;
  objectives: string[];
  topics: string[];
  estimatedDuration: string;
  resources: Resource[];
  practicalTask: string;
  /** Shown as the learner's next focus while this module is current. */
  focus: string;
  /** Set only when completing this module can be verified on Stellar. */
  achievementId?: string;
};

export type ModuleProgress = {
  moduleId: string;
  status: Exclude<ModuleStatus, "upcoming">;
  completedAt?: string;
};

export type AchievementDefinition = {
  id: string;
  name: string;
  description: string;
  pathId: LearningPathId;
  moduleId: string;
};

/**
 * On-chain records store an achievement code only.
 * Never include a learner's name, email, age, or location.
 */
export type StellarVerification =
  | { status: "ready" }
  | { status: "pending" }
  | {
      status: "verified";
      network: StellarNetwork;
      transactionHash: string;
      explorerUrl: string;
      recordedAt: string;
      /** Public marker recorded on-chain (memo or hash-derived code). */
      achievementCode: string;
      /** Stellar account (public key) that signed the verification transaction. */
      account: string;
    }
  | { status: "failed"; message: string };

export type KnowledgeCheckResult =
  | { status: "required" }
  | { status: "passed"; passedAt: string; score: number; total: number };

export type EarnedAchievement = {
  achievementId: string;
  earnedAt: string;
  verification: StellarVerification;
  /** Short quiz on roadmap topics — must pass before Stellar verification. */
  knowledgeCheck?: KnowledgeCheckResult;
};

export type MentorshipGuidance = {
  message: string;
  resourceTitle?: string;
  resourceUrl?: string;
  submittedAt: string;
};

export type MentorshipRequest = {
  id: string;
  learnerId: string;
  learnerDisplayName: string;
  mentorId: string;
  pathId: LearningPathId;
  moduleId: string;
  topic: string;
  description: string;
  status: MentorshipStatus;
  createdAt: string;
  updatedAt: string;
  guidance?: MentorshipGuidance;
};
