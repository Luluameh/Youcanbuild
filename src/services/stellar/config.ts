import { Networks } from "@stellar/stellar-sdk";
import type { StellarNetwork } from "@/types/index.ts";

export type StellarAppConfig = {
  network: StellarNetwork;
  horizonUrl: string;
  rpcUrl: string;
  networkPassphrase: string;
  explorerBaseUrl: string;
  friendbotUrl: string;
};

const TESTNET_PASSPHRASE = Networks.TESTNET;

export function getStellarConfig(): StellarAppConfig {
  const network = (import.meta.env.VITE_STELLAR_NETWORK ?? "testnet") as StellarNetwork;
  const horizonUrl = import.meta.env.VITE_STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org";
  const rpcUrl = import.meta.env.VITE_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org";
  const networkPassphrase =
    import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE ?? TESTNET_PASSPHRASE;
  const explorerBaseUrl =
    import.meta.env.VITE_STELLAR_EXPLORER_URL ?? "https://stellar.expert/explorer/testnet";

  if (network !== "testnet") {
    throw new Error("YouCanBuild MVP only supports Stellar testnet verification.");
  }

  return {
    network,
    horizonUrl,
    rpcUrl,
    networkPassphrase,
    explorerBaseUrl,
    friendbotUrl: "https://friendbot.stellar.org",
  };
}

export function transactionExplorerUrl(transactionHash: string): string {
  const config = getStellarConfig();
  return `${config.explorerBaseUrl}/tx/${transactionHash}`;
}

export function friendbotFundUrl(publicKey: string): string {
  const config = getStellarConfig();
  return `${config.friendbotUrl}/?addr=${encodeURIComponent(publicKey)}`;
}

export function isConfiguredTestnetPassphrase(passphrase: string): boolean {
  return passphrase === getStellarConfig().networkPassphrase;
}
