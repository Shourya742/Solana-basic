import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { airdrop } from "../airdrop";

export const showBalance = async (publickey: PublicKey) => {
  const connection = new Connection("http://localhost:8899", "confirmed");
  const response = await connection.getAccountInfo(publickey);
  return response?.lamports;
};

(async () => {
  const publickey = "BzTnPTjmMvkixgTZRrYcWaitAB2gwA1YUT2PGzHQVQSx";
  const balance = await showBalance(new PublicKey(publickey));
  console.log(balance);
  await airdrop(new PublicKey(publickey), 5);
  const balance_new = await showBalance(new PublicKey(publickey));
  console.log(balance_new);
})();
