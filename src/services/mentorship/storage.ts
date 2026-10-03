import type { MentorshipRequest } from "@/types/index.ts";

const REQUESTS_KEY = "youcanbuild:mentorship-requests";
const SAFETY_KEY = "youcanbuild:learner-safety";

export type LearnerSafetyRecord = {
  blockedMentorIds: Record<string, string[]>;
  reportedRequestIds: string[];
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

export function loadMentorshipRequests(): MentorshipRequest[] {
  return readJson<MentorshipRequest[]>(REQUESTS_KEY) ?? [];
}

export function saveMentorshipRequests(requests: MentorshipRequest[]) {
  writeJson(REQUESTS_KEY, requests);
}

export function loadLearnerSafety(): LearnerSafetyRecord {
  return (
    readJson<LearnerSafetyRecord>(SAFETY_KEY) ?? {
      blockedMentorIds: {},
      reportedRequestIds: [],
    }
  );
}

export function saveLearnerSafety(record: LearnerSafetyRecord) {
  writeJson(SAFETY_KEY, record);
}

export function clearMentorshipStorage() {
  localStorage.removeItem(REQUESTS_KEY);
}
