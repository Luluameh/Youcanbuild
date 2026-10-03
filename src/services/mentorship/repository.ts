import { mentorshipSeedRequests } from "@/data/mentorship.ts";
import { getMentor, getModule } from "@/data/catalog.ts";
import {
  loadLearnerSafety,
  loadMentorshipRequests,
  saveLearnerSafety,
  saveMentorshipRequests,
} from "@/services/mentorship/storage.ts";
import type {
  LearningPathId,
  MentorshipGuidance,
  MentorshipRequest,
  MentorshipStatus,
} from "@/types/index.ts";

export type CreateMentorshipInput = {
  learnerId: string;
  learnerDisplayName: string;
  mentorId: string;
  pathId: LearningPathId;
  moduleId: string;
  topic: string;
  description: string;
};

export type TransitionResult =
  | { ok: true; request: MentorshipRequest }
  | { ok: false; message: string };

const ALLOWED: Record<MentorshipStatus, MentorshipStatus[]> = {
  pending: ["accepted", "declined"],
  accepted: ["completed"],
  declined: [],
  completed: [],
};

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowIso(): string {
  return new Date().toISOString();
}

export function ensureMentorshipSeeded(): MentorshipRequest[] {
  const existing = loadMentorshipRequests();
  if (existing.length > 0) {
    return existing;
  }
  saveMentorshipRequests(mentorshipSeedRequests);
  return mentorshipSeedRequests;
}

export function listMentorshipRequests(): MentorshipRequest[] {
  return ensureMentorshipSeeded();
}

export function getMentorshipRequest(id: string): MentorshipRequest | undefined {
  return listMentorshipRequests().find((request) => request.id === id);
}

export function getRequestsForLearner(learnerId: string): MentorshipRequest[] {
  return listMentorshipRequests()
    .filter((request) => request.learnerId === learnerId)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function getRequestsForMentor(mentorCatalogId: string): MentorshipRequest[] {
  return listMentorshipRequests()
    .filter((request) => request.mentorId === mentorCatalogId)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function createMentorshipRequest(
  input: CreateMentorshipInput,
): { ok: true; request: MentorshipRequest } | { ok: false; message: string } {
  if (!getMentor(input.mentorId)) {
    return { ok: false, message: "That mentor is not available." };
  }
  const module = getModule(input.moduleId);
  if (!module || module.pathId !== input.pathId) {
    return { ok: false, message: "Choose a module on your current learning path." };
  }
  if (!input.topic.trim()) {
    return { ok: false, message: "Add a short topic so the mentor knows what you need." };
  }
  if (input.description.trim().length < 12) {
    return { ok: false, message: "Describe where you are stuck in at least a sentence or two." };
  }

  const createdAt = todayIsoDate();
  const request: MentorshipRequest = {
    id: crypto.randomUUID(),
    learnerId: input.learnerId,
    learnerDisplayName: input.learnerDisplayName,
    mentorId: input.mentorId,
    pathId: input.pathId,
    moduleId: input.moduleId,
    topic: input.topic.trim(),
    description: input.description.trim(),
    status: "pending",
    createdAt,
    updatedAt: nowIso(),
  };

  const next = [...listMentorshipRequests(), request];
  saveMentorshipRequests(next);
  return { ok: true, request };
}

export function transitionMentorshipRequest(
  requestId: string,
  nextStatus: MentorshipStatus,
  mentorCatalogId: string,
): TransitionResult {
  const requests = listMentorshipRequests();
  const index = requests.findIndex((request) => request.id === requestId);
  if (index < 0) {
    return { ok: false, message: "Request not found." };
  }

  const current = requests[index];
  if (current.mentorId !== mentorCatalogId) {
    return { ok: false, message: "You can only update requests assigned to you." };
  }

  if (!ALLOWED[current.status].includes(nextStatus)) {
    return { ok: false, message: "That status change is not allowed." };
  }

  const updated: MentorshipRequest = {
    ...current,
    status: nextStatus,
    updatedAt: nowIso(),
  };

  const next = [...requests];
  next[index] = updated;
  saveMentorshipRequests(next);
  return { ok: true, request: updated };
}

export function submitMentorshipGuidance(
  requestId: string,
  mentorCatalogId: string,
  guidance: Omit<MentorshipGuidance, "submittedAt">,
): TransitionResult {
  const requests = listMentorshipRequests();
  const index = requests.findIndex((request) => request.id === requestId);
  if (index < 0) {
    return { ok: false, message: "Request not found." };
  }

  const current = requests[index];
  if (current.mentorId !== mentorCatalogId) {
    return { ok: false, message: "You can only respond to your own requests." };
  }
  if (current.status !== "accepted" && current.status !== "completed") {
    return { ok: false, message: "Guidance can be added after a request is accepted." };
  }
  if (!guidance.message.trim()) {
    return { ok: false, message: "Write a short structured guidance response." };
  }

  const updated: MentorshipRequest = {
    ...current,
    guidance: {
      message: guidance.message.trim(),
      resourceTitle: guidance.resourceTitle?.trim() || undefined,
      resourceUrl: guidance.resourceUrl?.trim() || undefined,
      submittedAt: nowIso(),
    },
    updatedAt: nowIso(),
  };

  const next = [...requests];
  next[index] = updated;
  saveMentorshipRequests(next);
  return { ok: true, request: updated };
}

export function removeRequestsForLearner(learnerId: string) {
  const next = listMentorshipRequests().filter((request) => request.learnerId !== learnerId);
  saveMentorshipRequests(next);
}

export function getBlockedMentorsForLearner(learnerId: string): string[] {
  const record = loadLearnerSafety();
  return record.blockedMentorIds[learnerId] ?? [];
}

export function blockMentorForLearner(learnerId: string, mentorId: string) {
  const record = loadLearnerSafety();
  const current = new Set(record.blockedMentorIds[learnerId] ?? []);
  current.add(mentorId);
  saveLearnerSafety({
    ...record,
    blockedMentorIds: {
      ...record.blockedMentorIds,
      [learnerId]: [...current],
    },
  });
}

export function reportMentorshipConcern(requestId: string) {
  const record = loadLearnerSafety();
  if (record.reportedRequestIds.includes(requestId)) {
    return;
  }
  saveLearnerSafety({
    ...record,
    reportedRequestIds: [...record.reportedRequestIds, requestId],
  });
}

export function mentorshipStatusLabel(status: MentorshipStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "completed":
      return "Completed";
    case "declined":
      return "Declined";
  }
}
