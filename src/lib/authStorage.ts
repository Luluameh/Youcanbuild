import {
  demoEarnedAchievements,
  demoLearnerProfile,
  demoLearnerProgress,
  demoLearnerUser,
  demoMentorProfile,
  demoMentorUser,
} from "@/data/demo.ts";
import type { StoredAccount } from "@/types/index.ts";

const SESSION_KEY = "youcanbuild:session";
const ACCOUNTS_KEY = "youcanbuild:accounts";

export type SessionRecord = {
  userId: string;
};

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadSession(): SessionRecord | null {
  return readJson<SessionRecord>(SESSION_KEY);
}

export function saveSession(session: SessionRecord | null) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  writeJson(SESSION_KEY, session);
}

export function loadAccounts(): Record<string, StoredAccount> {
  return readJson<Record<string, StoredAccount>>(ACCOUNTS_KEY) ?? {};
}

export function saveAccounts(accounts: Record<string, StoredAccount>) {
  writeJson(ACCOUNTS_KEY, accounts);
}

export function ensureDemoLearnerAccount(accounts: Record<string, StoredAccount>): Record<string, StoredAccount> {
  if (accounts[demoLearnerUser.id]) {
    return accounts;
  }

  return {
    ...accounts,
    [demoLearnerUser.id]: {
      user: demoLearnerUser,
      password: "demo-ada",
      learner: {
        profile: demoLearnerProfile,
        moduleProgress: demoLearnerProgress,
        earnedAchievements: demoEarnedAchievements,
      },
    },
  };
}

export function ensureDemoMentorAccount(accounts: Record<string, StoredAccount>): Record<string, StoredAccount> {
  if (accounts[demoMentorUser.id]) {
    return accounts;
  }

  return {
    ...accounts,
    [demoMentorUser.id]: {
      user: demoMentorUser,
      password: "demo-amara",
      mentor: demoMentorProfile,
    },
  };
}

export function resetDemoLearnerAccount(accounts: Record<string, StoredAccount>): Record<string, StoredAccount> {
  const seeded = ensureDemoLearnerAccount(accounts);
  return {
    ...seeded,
    [demoLearnerUser.id]: {
      user: demoLearnerUser,
      password: "demo-ada",
      learner: {
        profile: demoLearnerProfile,
        moduleProgress: demoLearnerProgress,
        earnedAchievements: demoEarnedAchievements,
      },
    },
  };
}

export const demoLearnerEmail = demoLearnerUser.email;
export const demoMentorEmail = demoMentorUser.email;
