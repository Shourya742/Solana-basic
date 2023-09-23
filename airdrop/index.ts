import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const airdrop = async (address: PublicKey, amount: number) => {
  const publicKey = new PublicKey(address);
  const conn = new Connection("http://localhost:8899", "confirmed");
  const signature = await conn.requestAirdrop(
    publicKey,
    amount * LAMPORTS_PER_SOL
  );
  await conn.confirmTransaction(signature);
};

// airdrop("BzTnPTjmMvkixgTZRrYcWaitAB2gwA1YUT2PGzHQVQSx", 1);
