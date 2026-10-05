import { getAchievement } from "@/data/catalog.ts";
import { transactionExplorerUrl } from "@/services/stellar/config.ts";
import {
  fetchTransactionStatus,
  loadAccount,
  submitSignedTransaction,
} from "@/services/stellar/client.ts";
import { isStellarServiceError, StellarServiceError } from "@/services/stellar/errors.ts";
import { buildAchievementVerificationTransaction } from "@/services/stellar/transactions.ts";
import type {
  VerificationPhaseListener,
  VerifiedAchievementRecord,
  VerifyAchievementServiceInput,
  VerifyAchievementServiceResult,
} from "@/services/stellar/types.ts";
import {
  assertWalletOnTestnet,
  connectStellarWallet,
  signStellarTransaction,
} from "@/services/stellar/wallet.ts";

function setPhase(listener: VerificationPhaseListener | undefined, phase: Parameters<VerificationPhaseListener>[0]) {
  listener?.(phase);
}

function verifiedRecordFromExisting(
  existing: Extract<VerifyAchievementServiceInput["existingVerification"], { status: "verified" }>,
): VerifiedAchievementRecord {
  return existing;
}

export async function verifyAchievementOnStellar(
  input: VerifyAchievementServiceInput,
  onPhase?: VerificationPhaseListener,
): Promise<VerifyAchievementServiceResult> {
  const definition = getAchievement(input.achievementId);
  if (!definition) {
    return {
      ok: false,
      error: new StellarServiceError("not-found", "That achievement is not in the catalog."),
    };
  }

  if (definition.pathId !== input.pathId) {
    return {
      ok: false,
      error: new StellarServiceError(
        "validation",
        "This achievement does not belong to your current learning path.",
      ),
    };
  }

  if (input.existingVerification.status === "verified") {
    return {
      ok: true,
      alreadyVerified: true,
      verification: verifiedRecordFromExisting(input.existingVerification),
    };
  }

  if (input.existingVerification.status !== "ready") {
    return {
      ok: false,
      error: new StellarServiceError(
        "not-ready",
        "Complete the milestone first. Verification is available when an achievement is ready.",
      ),
    };
  }

  try {
    setPhase(onPhase, "connecting-wallet");
    const wallet = await connectStellarWallet();
    await assertWalletOnTestnet();

    setPhase(onPhase, "building");
    try {
      await loadAccount(wallet.publicKey);
    } catch (error) {
      if (isStellarServiceError(error) && error.code === "account-unfunded") {
        throw new StellarServiceError("account-unfunded", error.message, {
          publicKey: wallet.publicKey,
          causeDetail: error.causeDetail,
        });
      }
      throw error;
    }

    const { transactionXdr, marker } = await buildAchievementVerificationTransaction(
      wallet.publicKey,
      input.achievementId,
      input.pathId,
    );

    setPhase(onPhase, "awaiting-signature");
    const signedXdr = await signStellarTransaction(transactionXdr, wallet.publicKey);

    setPhase(onPhase, "submitting");
    let transactionHash: string;
    try {
      const submission = await submitSignedTransaction(signedXdr);
      if (!submission.successful) {
        throw new StellarServiceError(
          "transaction-failed",
          "Stellar testnet rejected the verification transaction. Your achievement is still ready to verify.",
        );
      }
      transactionHash = submission.transactionHash;
    } catch (error) {
      if (isStellarServiceError(error) && error.code === "submission-uncertain" && error.transactionHash) {
        const status = await fetchTransactionStatus(error.transactionHash);
        if (status.found && status.successful) {
          transactionHash = error.transactionHash;
        } else if (status.found && !status.successful) {
          throw new StellarServiceError(
            "transaction-failed",
            "The verification transaction failed on Stellar testnet. Your achievement is still ready to verify.",
            { transactionHash: error.transactionHash },
          );
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }

    const confirmed = await fetchTransactionStatus(transactionHash);
    if (!confirmed.found || !confirmed.successful) {
      throw new StellarServiceError(
        "submission-uncertain",
        "We could not confirm the verification transaction yet. Wait a moment and check again before signing a new one.",
        { transactionHash },
      );
    }

    const verification: VerifiedAchievementRecord = {
      status: "verified",
      network: "testnet",
      transactionHash,
      explorerUrl: transactionExplorerUrl(transactionHash),
      recordedAt: new Date().toISOString().slice(0, 10),
      achievementCode: marker.achievementCode,
      account: wallet.publicKey,
    };

    setPhase(onPhase, "confirmed");
    return { ok: true, alreadyVerified: false, verification };
  } catch (error) {
    setPhase(onPhase, "error");
    if (isStellarServiceError(error)) {
      if (error.code === "wrong-network") {
        setPhase(onPhase, "wrong-network");
      }
      if (error.code === "wallet-rejected") {
        return { ok: false, cancelled: true, error };
      }
      return { ok: false, error };
    }
    return {
      ok: false,
      error: new StellarServiceError(
        "horizon-error",
        "Something went wrong during verification. Your learning progress is unchanged.",
        { causeDetail: error instanceof Error ? error.message : String(error) },
      ),
    };
  }
}

export { fetchTransactionStatus } from "@/services/stellar/client.ts";
