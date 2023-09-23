import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { airdrop } from "../airdrop";
import { showBalance } from "../show-balance";

export const transferSol = async (
  from: Keypair,
  to: PublicKey,
  amount: number
) => {
  const connection = new Connection("http://localhost:8899", "confirmed");
  const transaction = new Transaction();
  const instruction = SystemProgram.transfer({
    fromPubkey: from.publicKey,
    toPubkey: to,
    lamports: LAMPORTS_PER_SOL * amount,
  });
  transaction.add(instruction);
  await sendAndConfirmTransaction(connection, transaction, [from]);
  console.log("Done");
};

const secret = Uint8Array.from([
  90, 229, 171, 71, 206, 169, 129, 202, 154, 49, 107, 8, 53, 40, 60, 130, 15,
  139, 4, 81, 128, 137, 85, 88, 68, 51, 10, 140, 125, 65, 216, 37, 7, 74, 59,
  81, 178, 128, 75, 42, 241, 73, 198, 140, 106, 158, 0, 214, 23, 190, 172, 138,
  113, 101, 229, 88, 244, 163, 75, 137, 76, 248, 252, 115,
]);

const fromKeyPair = Keypair.fromSecretKey(secret);
const toPublicKey = new PublicKey(
  "BzTnPTjmMvkixgTZRrYcWaitAB2gwA1YUT2PGzHQVQSx"
);

(async () => {
  await airdrop(fromKeyPair.publicKey, 4);
  const fromBalance = await showBalance(fromKeyPair.publicKey);
  console.log(`Initial balance of from wallet is ${fromBalance}`);
  const toBalance = await showBalance(toPublicKey);
  console.log(`Initial Balance of To wallet is ${toBalance}`);
  await transferSol(fromKeyPair, toPublicKey, 2);
  const fromBalance2 = await showBalance(fromKeyPair.publicKey);
  console.log(`Initial balance of from wallet is ${fromBalance2}`);
  const toBalance2 = await showBalance(toPublicKey);
  console.log(`Initial Balance of To wallet is ${toBalance2}`);
})();
