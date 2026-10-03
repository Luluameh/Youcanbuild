import type { StellarVerification } from "@/types/index.ts";
import type { LearningPathId } from "@/types/index.ts";

export type VerificationPhase =
  | "idle"
  | "connecting-wallet"
  | "wrong-network"
  | "building"
  | "awaiting-signature"
  | "submitting"
  | "confirmed"
  | "error";

export type AchievementMarker = {
  /** Value stored locally and echoed in UI. */
  achievementCode: string;
  /** Bytes placed on-ledger (text memo or hash). */
  onChainValue: string;
  memoKind: "text" | "hash";
  byteLength: number;
};

export type BuildVerificationTransactionResult = {
  transactionXdr: string;
  marker: AchievementMarker;
};

export type SubmitVerificationResult = {
  transactionHash: string;
  successful: boolean;
};

export type VerifiedAchievementRecord = Extract<StellarVerification, { status: "verified" }>;

export type VerifyAchievementServiceInput = {
  achievementId: string;
  pathId: LearningPathId;
  existingVerification: StellarVerification;
};

export type VerifyAchievementServiceSuccess = {
  ok: true;
  verification: VerifiedAchievementRecord;
  alreadyVerified: boolean;
};

export type VerifyAchievementServiceFailure = {
  ok: false;
  cancelled?: boolean;
  error: import("@/services/stellar/errors.ts").StellarServiceError;
};

export type VerifyAchievementServiceResult =
  | VerifyAchievementServiceSuccess
  | VerifyAchievementServiceFailure;

export type VerificationPhaseListener = (phase: VerificationPhase) => void;
