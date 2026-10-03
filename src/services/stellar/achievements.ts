/**
 * Achievement marker encoding (Phase 5)
 *
 * Canonical proof input (off-chain, never sent verbatim if too long):
 *   YouCanBuild|v1|<achievementId>|<pathId>
 *
 * On-ledger preference:
 *   Memo.text "YCB:v1:<achievementId>" when UTF-8 length <= 28 bytes (Stellar MEMO_TEXT limit).
 *   Otherwise Memo.hash(SHA-256(canonical)) — 32-byte hash; achievementCode still stores the readable YCB form locally.
 */

import { Memo } from "@stellar/stellar-sdk";
import type { LearningPathId } from "@/types/index.ts";
import { StellarServiceError } from "@/services/stellar/errors.ts";
import type { AchievementMarker } from "@/services/stellar/types.ts";

const MEMO_TEXT_MAX_BYTES = 28;
const MARKER_VERSION = "v1";

function canonicalProofInput(achievementId: string, pathId: LearningPathId): string {
  return `YouCanBuild|${MARKER_VERSION}|${achievementId}|${pathId}`;
}

function readableCode(achievementId: string): string {
  return `YCB:${MARKER_VERSION}:${achievementId}`;
}

async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
  const copy = new Uint8Array(bytes);
  const digest = await crypto.subtle.digest("SHA-256", copy);
  return new Uint8Array(digest);
}

export async function buildAchievementMarker(
  achievementId: string,
  pathId: LearningPathId,
): Promise<AchievementMarker> {
  if (!achievementId.trim()) {
    throw new StellarServiceError("invalid-marker", "Achievement marker is missing an id.");
  }

  const textCandidate = readableCode(achievementId);
  const textBytes = new TextEncoder().encode(textCandidate);
  if (textBytes.length <= MEMO_TEXT_MAX_BYTES) {
    return {
      achievementCode: textCandidate,
      onChainValue: textCandidate,
      memoKind: "text",
      byteLength: textBytes.length,
    };
  }

  const canonical = canonicalProofInput(achievementId, pathId);
  const hash = await sha256(new TextEncoder().encode(canonical));
  const hashHex = Array.from(hash)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return {
    achievementCode: textCandidate,
    onChainValue: hashHex,
    memoKind: "hash",
    byteLength: hash.length,
  };
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

export function memoFromMarker(marker: AchievementMarker): Memo {
  if (marker.memoKind === "text") {
    const bytes = new TextEncoder().encode(marker.onChainValue);
    if (bytes.length > MEMO_TEXT_MAX_BYTES) {
      throw new StellarServiceError("invalid-marker", "Achievement marker exceeds the Stellar memo limit.");
    }
    return Memo.text(marker.onChainValue);
  }

  const hashBytes = hexToBytes(marker.onChainValue);
  if (hashBytes.length !== 32) {
    throw new StellarServiceError("invalid-marker", "Hashed achievement marker is invalid.");
  }
  return Memo.hash(hashBytes);
}

export const ACHIEVEMENT_MARKER_DOC = {
  memoTextMaxBytes: MEMO_TEXT_MAX_BYTES,
  readablePrefix: "YCB:v1:",
  canonicalFormat: "YouCanBuild|v1|<achievementId>|<pathId>",
} as const;
