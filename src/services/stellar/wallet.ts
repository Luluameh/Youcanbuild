export {
  assertWalletOnTestnet,
  connectStellarWalletViaKit as connectStellarWallet,
  ensureStellarWalletKitReady,
  signStellarTransactionViaKit as signStellarTransaction,
  testnetFundingHelp,
  type WalletSession,
} from "@/services/stellar/walletKit.ts";
