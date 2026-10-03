import {
  Asset,
  BASE_FEE,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { getStellarConfig } from "@/services/stellar/config.ts";
import { buildAchievementMarker, memoFromMarker } from "@/services/stellar/achievements.ts";
import { loadAccount } from "@/services/stellar/client.ts";
import type { BuildVerificationTransactionResult } from "@/services/stellar/types.ts";
import type { LearningPathId } from "@/types/index.ts";

/** Minimum native payment used for a self-payment proof (classic Stellar, no custom assets). */
const SELF_PAYMENT_AMOUNT = "0.0000001";

export async function buildAchievementVerificationTransaction(
  publicKey: string,
  achievementId: string,
  pathId: LearningPathId,
): Promise<BuildVerificationTransactionResult> {
  const config = getStellarConfig();
  const account = await loadAccount(publicKey);
  const marker = await buildAchievementMarker(achievementId, pathId);
  const memo = memoFromMarker(marker);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: config.networkPassphrase,
    memo,
  })
    .addOperation(
      Operation.payment({
        destination: publicKey,
        asset: Asset.native(),
        amount: SELF_PAYMENT_AMOUNT,
      }),
    )
    .setTimeout(60)
    .build();

  return {
    transactionXdr: transaction.toXDR(),
    marker,
  };
}

export const VERIFICATION_TX_MECHANISM =
  "Classic Stellar testnet self-payment (0.0000001 XLM) with MEMO_TEXT or MEMO_HASH carrying the achievement marker." as const;
