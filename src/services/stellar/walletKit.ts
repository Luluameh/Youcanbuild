import { friendbotFundUrl, getStellarConfig } from "@/services/stellar/config.ts";
import { isStellarServiceError, StellarServiceError } from "@/services/stellar/errors.ts";

let initPromise: Promise<void> | null = null;

async function loadKit() {
  const [{ StellarWalletsKit }, { defaultModules }, { Networks }] = await Promise.all([
    import("@creit.tech/stellar-wallets-kit/sdk"),
    import("@creit.tech/stellar-wallets-kit/modules/utils"),
    import("@creit.tech/stellar-wallets-kit/types"),
  ]);
  return { StellarWalletsKit, defaultModules, Networks };
}

export async function ensureStellarWalletKitReady(): Promise<
  Awaited<ReturnType<typeof loadKit>>["StellarWalletsKit"]
> {
  if (typeof window === "undefined") {
    throw new StellarServiceError(
      "wallet-unavailable",
      "Stellar wallets are only available in a web browser.",
    );
  }

  if (!initPromise) {
    initPromise = (async () => {
      const { StellarWalletsKit, defaultModules, Networks } = await loadKit();
      StellarWalletsKit.init({
        network: Networks.TESTNET,
        modules: defaultModules(),
        authModal: {
          showInstallLabel: true,
          hideUnsupportedWallets: false,
        },
      });
    })();
  }

  await initPromise;
  const { StellarWalletsKit } = await loadKit();
  return StellarWalletsKit;
}

function isUserDismissedError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return /cancel|closed|reject|denied|dismiss|abort/i.test(error.message);
}

export type WalletSession = {
  publicKey: string;
};

/** Opens the kit wallet picker and connects the chosen wallet (Freighter, LOBSTR, xBull, WalletConnect, …). */
export async function connectStellarWalletViaKit(): Promise<WalletSession> {
  const StellarWalletsKit = await ensureStellarWalletKitReady();

  try {
    const { address } = await StellarWalletsKit.authModal();
    if (!address) {
      throw new StellarServiceError("wallet-unavailable", "No Stellar account was returned from your wallet.");
    }
    return { publicKey: address };
  } catch (error) {
    if (isStellarServiceError(error)) {
      throw error;
    }
    if (isUserDismissedError(error)) {
      throw new StellarServiceError(
        "wallet-rejected",
        "Verification cancelled. Your achievement is still earned and ready to verify whenever you want.",
        { causeDetail: error instanceof Error ? error.message : String(error) },
      );
    }
    throw new StellarServiceError(
      "wallet-unavailable",
      "Could not connect a Stellar wallet. Install Freighter or LOBSTR Signer, or pick WalletConnect for mobile.",
      { causeDetail: error instanceof Error ? error.message : String(error) },
    );
  }
}

export async function assertWalletOnTestnet(): Promise<void> {
  const StellarWalletsKit = await ensureStellarWalletKitReady();
  const config = getStellarConfig();

  try {
    const network = await StellarWalletsKit.getNetwork();
    const passphrase = network.networkPassphrase ?? "";

    if (passphrase && passphrase !== config.networkPassphrase) {
      throw new StellarServiceError(
        "wrong-network",
        "Switch your wallet to Stellar Testnet. This demo verifies achievements on testnet only.",
        { causeDetail: `${network.network} / ${passphrase}` },
      );
    }
  } catch (error) {
    if (isStellarServiceError(error)) {
      throw error;
    }
    // Some wallets do not expose network until after sign; allow verify to continue.
  }
}

export async function signStellarTransactionViaKit(
  transactionXdr: string,
  publicKey: string,
): Promise<string> {
  const StellarWalletsKit = await ensureStellarWalletKitReady();
  const config = getStellarConfig();

  try {
    const signed = await StellarWalletsKit.signTransaction(transactionXdr, {
      networkPassphrase: config.networkPassphrase,
      address: publicKey,
    });

    if (!signed.signedTxXdr) {
      throw new StellarServiceError("wallet-unavailable", "Your wallet did not return a signed transaction.");
    }

    return signed.signedTxXdr;
  } catch (error) {
    if (isStellarServiceError(error)) {
      throw error;
    }
    if (isUserDismissedError(error)) {
      throw new StellarServiceError(
        "wallet-rejected",
        "Verification cancelled. Your achievement is still earned and ready to verify whenever you want.",
        { causeDetail: error instanceof Error ? error.message : String(error) },
      );
    }
    throw new StellarServiceError("wallet-unavailable", error instanceof Error ? error.message : String(error));
  }
}

export function testnetFundingHelp(publicKey: string): { message: string; fundUrl: string } {
  return {
    message:
      "Testnet demo: fund this account with Friendbot (free test XLM), then return to verify. No secret keys are stored in YouCanBuild.",
    fundUrl: friendbotFundUrl(publicKey),
  };
}
