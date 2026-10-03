/**
 * Smoke test: real Stellar testnet verification transaction (no Freighter).
 * Run: npm run stellar:smoke
 */
import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

const HORIZON = "https://horizon-testnet.stellar.org";
const EXPLORER = "https://stellar.expert/explorer/testnet/tx";
const MARKER = "YCB:v1:html-foundations";

const server = new Horizon.Server(HORIZON);
const source = Keypair.random();

console.log("Funding test account via Friendbot…");
await fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(source.publicKey())}`);
const account = await server.loadAccount(source.publicKey());

const tx = new TransactionBuilder(account, {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
  memo: Memo.text(MARKER),
})
  .addOperation(
    Operation.payment({
      destination: source.publicKey(),
      asset: Asset.native(),
      amount: "0.0000001",
    }),
  )
  .setTimeout(60)
  .build();

tx.sign(source);
const result = await server.submitTransaction(tx);

if (!result.successful) {
  console.error("Transaction failed", result);
  process.exit(1);
}

console.log("SUCCESS");
console.log("Marker:", MARKER);
console.log("Hash:", result.hash);
console.log("Explorer:", `${EXPLORER}/${result.hash}`);

const status = await server.transactions().transaction(result.hash).call();
console.log("Horizon successful:", status.successful);
