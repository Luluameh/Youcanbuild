import {
  getNetwork,
  isBrowser,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import { friendbotFundUrl, getStellarConfig, isConfiguredTestnetPassphrase } from "@/services/stellar/config.ts";
import { StellarServiceError } from "@/services/stellar/errors.ts";

export type WalletSession = {
  publicKey: string;
};

export async function assertFreighterAvailable(): Promise<void> {
  if (!isBrowser) {
    throw new StellarServiceError(
      "wallet-unavailable",
      "Freighter is only available in a browser with the extension installed.",
    );
  }

  const connection = await isConnected();
  if (connection.error) {
    throw new StellarServiceError("wallet-unavailable", connection.error.message);
  }
  if (!connection.isConnected) {
    throw new StellarServiceError(
      "wallet-unavailable",
      "Install the Freighter wallet extension to verify achievements on Stellar testnet.",
    );
  }
}

export async function connectFreighterWallet(): Promise<WalletSession> {
  await assertFreighterAvailable();
  const access = await requestAccess();
  if (access.error) {
    if (/reject|denied|cancel/i.test(access.error.message)) {
      throw new StellarServiceError("wallet-rejected", "Verification cancelled", {
        causeDetail: access.error.message,
      });
    }
    throw new StellarServiceError("wallet-unavailable", access.error.message);
  }
  if (!access.address) {
    throw new StellarServiceError("wallet-unavailable", "Freighter did not return a public key.");
  }
  return { publicKey: access.address };
}

export async function assertFreighterOnTestnet(): Promise<void> {
  const network = await getNetwork();
  if (network.error) {
    throw new StellarServiceError("wallet-unavailable", network.error.message);
  }

  const networkName = network.network?.toUpperCase() ?? "";
  const passphraseMatches = isConfiguredTestnetPassphrase(network.networkPassphrase);

  if (networkName !== "TESTNET" || !passphraseMatches) {
    throw new StellarServiceError(
      "wrong-network",
      "Switch to Stellar Testnet in Freighter. This demo verifies achievements on Stellar Testnet only.",
      { causeDetail: `${network.network} / ${network.networkPassphrase}` },
    );
  }
}

export async function signFreighterTransaction(
  transactionXdr: string,
  publicKey: string,
): Promise<string> {
  const config = getStellarConfig();
  const signed = await signTransaction(transactionXdr, {
    networkPassphrase: config.networkPassphrase,
    address: publicKey,
  });

  if (signed.error) {
    if (/reject|denied|cancel|user/i.test(signed.error.message)) {
      throw new StellarServiceError(
        "wallet-rejected",
        "Verification cancelled. Your achievement is still earned and ready to verify whenever you want.",
        { causeDetail: signed.error.message },
      );
    }
    throw new StellarServiceError("wallet-unavailable", signed.error.message);
  }

  return signed.signedTxXdr;
}

export function testnetFundingHelp(publicKey: string): { message: string; fundUrl: string } {
  return {
    message:
      "Testnet demo: fund this account with Friendbot (free test XLM), then return to verify. No secret keys are stored in YouCanBuild.",
    fundUrl: friendbotFundUrl(publicKey),
  };
}
