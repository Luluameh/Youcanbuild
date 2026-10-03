import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  blockMentorForLearner,
  createMentorshipRequest,
  getBlockedMentorsForLearner,
  getMentorshipRequest,
  getRequestsForLearner,
  getRequestsForMentor,
  listMentorshipRequests,
  removeRequestsForLearner,
  reportMentorshipConcern,
  submitMentorshipGuidance,
  transitionMentorshipRequest,
  type CreateMentorshipInput,
} from "@/services/mentorship/repository.ts";
import type { MentorshipGuidance, MentorshipRequest, MentorshipStatus } from "@/types/index.ts";

type MentorshipContextValue = {
  requests: MentorshipRequest[];
  refresh: () => void;
  getRequest: (id: string) => MentorshipRequest | undefined;
  getLearnerRequests: (learnerId: string) => MentorshipRequest[];
  getMentorRequests: (mentorCatalogId: string) => MentorshipRequest[];
  createRequest: (
    input: CreateMentorshipInput,
  ) => { ok: true; request: MentorshipRequest } | { ok: false; message: string };
  updateStatus: (
    requestId: string,
    status: MentorshipStatus,
    mentorCatalogId: string,
  ) => { ok: true; request: MentorshipRequest } | { ok: false; message: string };
  saveGuidance: (
    requestId: string,
    mentorCatalogId: string,
    guidance: Omit<MentorshipGuidance, "submittedAt">,
  ) => { ok: true; request: MentorshipRequest } | { ok: false; message: string };
  blockedMentorIds: (learnerId: string) => string[];
  blockMentor: (learnerId: string, mentorId: string) => void;
  reportConcern: (requestId: string) => void;
  resetLearnerRequests: (learnerId: string) => void;
};

const MentorshipContext = createContext<MentorshipContextValue | null>(null);

export function MentorshipProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState(() => listMentorshipRequests());
  const [safetyTick, setSafetyTick] = useState(0);

  const refresh = useCallback(() => {
    setRequests(listMentorshipRequests());
  }, []);

  const value = useMemo<MentorshipContextValue>(
    () => ({
      requests,
      refresh,
      getRequest: (id) => getMentorshipRequest(id),
      getLearnerRequests: (learnerId) => getRequestsForLearner(learnerId),
      getMentorRequests: (mentorCatalogId) => getRequestsForMentor(mentorCatalogId),
      createRequest: (input) => {
        const result = createMentorshipRequest(input);
        if (result.ok) {
          refresh();
        }
        return result;
      },
      updateStatus: (requestId, status, mentorCatalogId) => {
        const result = transitionMentorshipRequest(requestId, status, mentorCatalogId);
        if (result.ok) {
          refresh();
        }
        return result;
      },
      saveGuidance: (requestId, mentorCatalogId, guidance) => {
        const result = submitMentorshipGuidance(requestId, mentorCatalogId, guidance);
        if (result.ok) {
          refresh();
        }
        return result;
      },
      blockedMentorIds: (learnerId) => {
        void safetyTick;
        return getBlockedMentorsForLearner(learnerId);
      },
      blockMentor: (learnerId, mentorId) => {
        blockMentorForLearner(learnerId, mentorId);
        setSafetyTick((tick) => tick + 1);
      },
      reportConcern: (requestId) => {
        reportMentorshipConcern(requestId);
        setSafetyTick((tick) => tick + 1);
      },
      resetLearnerRequests: (learnerId) => {
        removeRequestsForLearner(learnerId);
        refresh();
      },
    }),
    [refresh, requests, safetyTick],
  );

  return <MentorshipContext.Provider value={value}>{children}</MentorshipContext.Provider>;
}

export function useMentorship(): MentorshipContextValue {
  const context = useContext(MentorshipContext);
  if (!context) {
    throw new Error("useMentorship must be used within MentorshipProvider.");
  }
  return context;
}
