import { Horizon, TransactionBuilder } from "@stellar/stellar-sdk";
import { getStellarConfig } from "@/services/stellar/config.ts";
import { normalizeHorizonError, StellarServiceError } from "@/services/stellar/errors.ts";
import type { SubmitVerificationResult } from "@/services/stellar/types.ts";

let horizonServer: Horizon.Server | null = null;

export function getHorizonServer(): Horizon.Server {
  if (!horizonServer) {
    const config = getStellarConfig();
    horizonServer = new Horizon.Server(config.horizonUrl);
  }
  return horizonServer;
}

export async function loadAccount(publicKey: string) {
  try {
    return await getHorizonServer().loadAccount(publicKey);
  } catch (error) {
    throw normalizeHorizonError(error);
  }
}

export async function fundTestnetAccount(publicKey: string): Promise<void> {
  const config = getStellarConfig();
  const response = await fetch(`${config.friendbotUrl}?addr=${encodeURIComponent(publicKey)}`);
  if (!response.ok) {
    throw new StellarServiceError(
      "account-unfunded",
      "Friendbot could not fund this testnet account. Try again from the Stellar laboratory or friendbot link.",
    );
  }
}

export async function submitSignedTransaction(signedXdr: string): Promise<SubmitVerificationResult> {
  const config = getStellarConfig();
  try {
    const transaction = TransactionBuilder.fromXDR(signedXdr, config.networkPassphrase);
    const result = await getHorizonServer().submitTransaction(transaction);
    return {
      transactionHash: result.hash,
      successful: result.successful,
    };
  } catch (error) {
    const response = (error as { response?: { data?: { hash?: string; status?: string } } })?.response;
    const hash = response?.data?.hash;
    if (hash) {
      throw new StellarServiceError(
        "submission-uncertain",
        "The network did not confirm submission yet. Checking the transaction before asking you to sign again.",
        { transactionHash: hash, causeDetail: response?.data?.status },
      );
    }
    throw normalizeHorizonError(error);
  }
}

export async function fetchTransactionStatus(
  transactionHash: string,
): Promise<{ found: boolean; successful: boolean }> {
  try {
    const tx = await getHorizonServer().transactions().transaction(transactionHash).call();
    return { found: true, successful: tx.successful };
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      return { found: false, successful: false };
    }
    throw normalizeHorizonError(error);
  }
}
