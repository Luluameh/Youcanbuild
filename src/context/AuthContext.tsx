import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ensureDemoLearnerAccount,
  ensureDemoMentorAccount,
  loadAccounts,
  loadSession,
  resetDemoLearnerAccount,
  saveAccounts,
  saveSession,
} from "@/lib/authStorage.ts";
import { demoLearnerUser, demoMentorUser } from "@/data/demo.ts";
import { getAchievement } from "@/data/catalog.ts";
import { StellarServiceError } from "@/services/stellar/errors.ts";
import { verifyAchievementOnStellar } from "@/services/stellar/verifyAchievement.ts";
import type { VerificationPhaseListener, VerifyAchievementServiceResult } from "@/services/stellar/types.ts";
import { createInitialProgress } from "@/lib/initialProgress.ts";
import { applyModuleCompletion, normalizeEarnedAchievements, normalizeModuleProgress, type CompleteModuleResult } from "@/lib/learnerProgress.ts";
import type {
  AccountMentorProfile,
  EarnedAchievement,
  ExperienceLevel,
  LearnerProfile,
  LearningGoal,
  LearningPathId,
  MentorAvailability,
  ModuleProgress,
  StoredAccount,
  User,
  UserRole,
} from "@/types/index.ts";

type SignUpInput = {
  displayName: string;
  email: string;
  password: string;
  role: UserRole;
};

type SignInInput = {
  email: string;
  password: string;
};

type LearnerOnboardingInput = {
  pathId: LearningPathId;
  experience: ExperienceLevel;
  goal: LearningGoal;
};

type MentorOnboardingInput = {
  displayName: string;
  bio: string;
  expertise: string[];
  technologies: string[];
  availability: MentorAvailability;
  pathIds: LearningPathId[];
};

type AuthContextValue = {
  ready: boolean;
  user: User | null;
  learnerProfile: LearnerProfile | null;
  moduleProgress: ModuleProgress[];
  earnedAchievements: EarnedAchievement[];
  mentorProfile: AccountMentorProfile | null;
  signUp: (input: SignUpInput) => { ok: true } | { ok: false; message: string };
  signIn: (input: SignInInput) =>
    | { ok: true; role: UserRole; onboardingComplete: boolean }
    | { ok: false; message: string };
  signInDemoAda: () => void;
  signInDemoAmara: () => void;
  resetAdaDemo: () => void;
  signOut: () => void;
  completeLearnerOnboarding: (input: LearnerOnboardingInput) => void;
  completeMentorOnboarding: (input: MentorOnboardingInput) => void;
  completeModule: (moduleId: string) => CompleteModuleResult;
  verifyAchievement: (
    achievementId: string,
    onPhase?: VerificationPhaseListener,
  ) => Promise<VerifyAchievementServiceResult>;
};

function repairLearnerAccount(account: StoredAccount): StoredAccount {
  const pathId = account.learner?.profile.pathId;
  if (!pathId || !account.learner) {
    return account;
  }

  const moduleProgress = normalizeModuleProgress(pathId, account.learner.moduleProgress);
  const earnedAchievements = normalizeEarnedAchievements(account.learner.earnedAchievements);
  const unchanged =
    moduleProgress.length === account.learner.moduleProgress.length &&
    moduleProgress.every((entry, index) => {
      const previous = account.learner?.moduleProgress[index];
      return (
        previous?.moduleId === entry.moduleId &&
        previous.status === entry.status &&
        previous.completedAt === entry.completedAt
      );
    }) &&
    earnedAchievements.length === account.learner.earnedAchievements.length &&
    earnedAchievements.every((entry, index) => {
      const previous = account.learner?.earnedAchievements[index];
      return (
        previous?.achievementId === entry.achievementId &&
        previous.verification.status === entry.verification.status
      );
    });

  if (unchanged) {
    return account;
  }

  return {
    ...account,
    learner: {
      ...account.learner,
      moduleProgress,
      earnedAchievements,
    },
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function findAccountByEmail(
  accounts: Record<string, StoredAccount>,
  email: string,
): StoredAccount | undefined {
  const normalized = normalizeEmail(email);
  return Object.values(accounts).find((account) => normalizeEmail(account.user.email) === normalized);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Record<string, StoredAccount>>(() => {
    let seeded = ensureDemoLearnerAccount(loadAccounts());
    seeded = ensureDemoMentorAccount(seeded);
    saveAccounts(seeded);
    return seeded;
  });
  const [userId, setUserId] = useState<string | null>(() => loadSession()?.userId ?? null);
  const ready = true;

  const activeAccount = useMemo(() => {
    if (!userId) {
      return null;
    }
    const account = accounts[userId];
    if (!account) {
      return null;
    }
    return repairLearnerAccount(account);
  }, [accounts, userId]);

  const persistAccounts = useCallback((next: Record<string, StoredAccount>) => {
    saveAccounts(next);
    setAccounts(next);
  }, []);

  const persistSession = useCallback((nextUserId: string | null) => {
    saveSession(nextUserId ? { userId: nextUserId } : null);
    setUserId(nextUserId);
  }, []);

  const signUp = useCallback(
    (input: SignUpInput): { ok: true } | { ok: false; message: string } => {
      const email = normalizeEmail(input.email);
      if (!input.displayName.trim()) {
        return { ok: false, message: "Enter your name." };
      }
      if (!email.includes("@")) {
        return { ok: false, message: "Enter a valid email address." };
      }
      if (input.password.length < 6) {
        return { ok: false, message: "Use a password with at least 6 characters." };
      }
      if (findAccountByEmail(accounts, email)) {
        return { ok: false, message: "An account with this email already exists. Sign in instead." };
      }

      const id = crypto.randomUUID();
      const user: User = {
        id,
        displayName: input.displayName.trim(),
        email,
        role: input.role,
      };

      const account: StoredAccount = {
        user,
        password: input.password,
        ...(input.role === "learner"
          ? {
              learner: {
                profile: {
                  userId: id,
                  displayName: user.displayName,
                  pathId: null,
                  experience: "beginner",
                  goal: "explore",
                  onboardingComplete: false,
                },
                moduleProgress: [],
                earnedAchievements: [],
              },
            }
          : {
              mentor: {
                userId: id,
                displayName: user.displayName,
                expertise: [],
                technologies: [],
                bio: "",
                availability: "available",
                pathIds: [],
                onboardingComplete: false,
                verification: "pending",
              },
            }),
      };

      const next = { ...accounts, [id]: account };
      persistAccounts(next);
      persistSession(id);
      return { ok: true };
    },
    [accounts, persistAccounts, persistSession],
  );

  const signIn = useCallback(
    (input: SignInInput):
      | { ok: true; role: UserRole; onboardingComplete: boolean }
      | { ok: false; message: string } => {
      const account = findAccountByEmail(accounts, input.email);
      if (!account || account.password !== input.password) {
        return { ok: false, message: "Email or password did not match. Try again." };
      }
      persistSession(account.user.id);
      const onboardingComplete =
        account.user.role === "learner"
          ? (account.learner?.profile.onboardingComplete ?? false)
          : (account.mentor?.onboardingComplete ?? false);
      return { ok: true, role: account.user.role, onboardingComplete };
    },
    [accounts, persistSession],
  );

  const signInDemoAda = useCallback(() => {
    let seeded = ensureDemoLearnerAccount(accounts);
    seeded = ensureDemoMentorAccount(seeded);
    persistAccounts(seeded);
    persistSession(demoLearnerUser.id);
  }, [accounts, persistAccounts, persistSession]);

  const signInDemoAmara = useCallback(() => {
    let seeded = ensureDemoLearnerAccount(accounts);
    seeded = ensureDemoMentorAccount(seeded);
    persistAccounts(seeded);
    const amara = seeded[demoMentorUser.id];
    if (amara) {
      persistSession(amara.user.id);
    }
  }, [accounts, persistAccounts, persistSession]);

  const resetAdaDemo = useCallback(() => {
    let next = resetDemoLearnerAccount(accounts);
    next = ensureDemoMentorAccount(next);
    persistAccounts(next);
    persistSession(demoLearnerUser.id);
  }, [accounts, persistAccounts, persistSession]);

  const signOut = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const completeLearnerOnboarding = useCallback(
    (input: LearnerOnboardingInput) => {
      if (!activeAccount || activeAccount.user.role !== "learner" || !activeAccount.learner) {
        return;
      }

      const profile: LearnerProfile = {
        ...activeAccount.learner.profile,
        pathId: input.pathId,
        experience: input.experience,
        goal: input.goal,
        onboardingComplete: true,
      };

      const nextAccount: StoredAccount = {
        ...activeAccount,
        learner: {
          profile,
          moduleProgress: createInitialProgress(input.pathId),
          earnedAchievements: [],
        },
      };

      persistAccounts({ ...accounts, [activeAccount.user.id]: nextAccount });
    },
    [accounts, activeAccount, persistAccounts],
  );

  const completeMentorOnboarding = useCallback(
    (input: MentorOnboardingInput) => {
      if (!activeAccount || activeAccount.user.role !== "mentor") {
        return;
      }

      const mentor: AccountMentorProfile = {
        userId: activeAccount.user.id,
        displayName: input.displayName.trim(),
        expertise: input.expertise,
        technologies: input.technologies,
        bio: input.bio.trim(),
        availability: input.availability,
        pathIds: input.pathIds,
        onboardingComplete: true,
        verification: "pending",
      };

      persistAccounts({
        ...accounts,
        [activeAccount.user.id]: { ...activeAccount, mentor },
      });
    },
    [accounts, activeAccount, persistAccounts],
  );

  const completeModule = useCallback(
    (moduleId: string): CompleteModuleResult => {
      if (!activeAccount?.learner?.profile.pathId) {
        return { ok: false, reason: "Choose a learning path to track progress." };
      }

      const pathId = activeAccount.learner.profile.pathId;
      const { moduleProgress, earnedAchievements, result } = applyModuleCompletion(
        pathId,
        moduleId,
        activeAccount.learner.moduleProgress,
        activeAccount.learner.earnedAchievements,
      );

      if (!result.ok) {
        return result;
      }

      persistAccounts({
        ...accounts,
        [activeAccount.user.id]: {
          ...activeAccount,
          learner: {
            ...activeAccount.learner,
            moduleProgress,
            earnedAchievements,
          },
        },
      });

      return result;
    },
    [accounts, activeAccount, persistAccounts],
  );

  const verifyAchievement = useCallback(
    async (
      achievementId: string,
      onPhase?: VerificationPhaseListener,
    ): Promise<VerifyAchievementServiceResult> => {
      if (!activeAccount?.user || activeAccount.user.role !== "learner" || !activeAccount.learner) {
        return {
          ok: false,
          error: new StellarServiceError("validation", "Sign in as a learner to verify achievements."),
        };
      }

      const pathId = activeAccount.learner.profile.pathId;
      if (!pathId) {
        return {
          ok: false,
          error: new StellarServiceError("validation", "Choose a learning path before verifying achievements."),
        };
      }

      const definition = getAchievement(achievementId);
      if (!definition) {
        return {
          ok: false,
          error: new StellarServiceError("not-found", "That achievement is not in the catalog."),
        };
      }

      const earned = activeAccount.learner.earnedAchievements.find(
        (item) => item.achievementId === achievementId,
      );
      if (!earned) {
        return {
          ok: false,
          error: new StellarServiceError("not-ready", "Earn this achievement on your roadmap before verifying it."),
        };
      }

      const result = await verifyAchievementOnStellar(
        {
          achievementId,
          pathId,
          existingVerification: earned.verification,
        },
        onPhase,
      );

      if (result.ok && !result.alreadyVerified) {
        const earnedAchievements = activeAccount.learner.earnedAchievements.map((item) =>
          item.achievementId === achievementId
            ? { ...item, verification: result.verification }
            : item,
        );

        persistAccounts({
          ...accounts,
          [activeAccount.user.id]: {
            ...activeAccount,
            learner: {
              ...activeAccount.learner,
              earnedAchievements,
            },
          },
        });
      }

      return result;
    },
    [accounts, activeAccount, persistAccounts],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      user: activeAccount?.user ?? null,
      learnerProfile: activeAccount?.learner?.profile ?? null,
      moduleProgress: activeAccount?.learner?.moduleProgress ?? [],
      earnedAchievements: activeAccount?.learner?.earnedAchievements ?? [],
      mentorProfile: activeAccount?.mentor ?? null,
      signUp,
      signIn,
      signInDemoAda,
      signInDemoAmara,
      resetAdaDemo,
      signOut,
      completeLearnerOnboarding,
      completeMentorOnboarding,
      completeModule,
      verifyAchievement,
    }),
    [
      ready,
      activeAccount,
      signUp,
      signIn,
      signInDemoAda,
      signInDemoAmara,
      resetAdaDemo,
      signOut,
      completeLearnerOnboarding,
      completeMentorOnboarding,
      completeModule,
      verifyAchievement,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
