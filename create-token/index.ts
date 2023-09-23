import {
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
} from "@solana/spl-token";
import {
  Keypair,
  sendAndConfirmTransaction,
  PublicKey,
  Connection,
  clusterApiUrl,
  Transaction,
} from "@solana/web3.js";
import { airdrop } from "../airdrop";

const createMint = async (mintWallet: any) => {
  const connection = new Connection("http://localhost:8899", "confirmed");
  const creatorToken = await Token.createMint(
    connection,
    mintWallet,
    mintWallet.publicKey,
    null,
    8,
    TOKEN_PROGRAM_ID
  );
  return creatorToken.publicKey;
};

const transferTokens = async (
  tokenAddress: PublicKey,
  mintWallet: Keypair,
  receiver: PublicKey
) => {
  const connection = new Connection("http://localhost:8899", "confirmed");
  const creatorToken = new Token(
    connection,
    tokenAddress,
    TOKEN_PROGRAM_ID,
    mintWallet
  );
  const mintTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(
    mintWallet.publicKey
  );
  await creatorToken.mintTo(
    mintTokenAccount.address,
    mintWallet.publicKey,
    [],
    1000000000
  );
  const receiverTokenAccount =
    await creatorToken.getOrCreateAssciatedAccountInfo(receiver);
  console.log("RecieverTokenAccount address " + receiverTokenAccount.address);
  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      mintTokenAccount.address,
      receiverTokenAccount.address,
      mintWallet.publicKey,
      [],
      100000000
    )
  );
  await sendAndConfirmTransaction(connection, transaction, [mintWallet], {
    commitment: "confirmed",
  });
};

async () => {
  const mintWallet = await Keypair.generate();
  await airdrop(mintWallet.publicKey, 2);
  const creatorTokenAddress = await createMint(mintWallet);
  await transferTokens(
    creatorTokenAddress,
    mintWallet,
    new PublicKey("BzTnPTjmMvkixgTZRrYcWaitAB2gwA1YUT2PGzHQVQSx")
  );
  console.log(`Creator Token address: ${creatorTokenAddress}`);
  console.log(`mintWallet address: ${mintWallet.publicKey}`);
};
