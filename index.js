import 'dotenv/config';
import Blockchain from "./core/Blockchain.js";
import P2PServer from "./p2p/p2pServer.js";
import app from "./app.js";
import Transaction from "./core/Transaction.js";
import pkg from 'elliptic';
const { ec: EC } = pkg;

const ec = new EC('secp256k1');
const myKey = ec.keyFromPrivate("44c0e75657dfe8ef3313b26f9d1c566eab44e94a4ad43e582f49513ef2ff9803");
const myWalletAddress = myKey.getPublic('hex');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const P2P_PORT = process.env.P2P_PORT || 5001;
const PEERS = process.env.PEERS ? process.env.PEERS.split(",") : [];

const blockchain = new Blockchain();
const p2pServer = new P2PServer(blockchain);

console.log("My Wallet Address:", myWalletAddress.substring(0, 20) + "...");


app.listen(HTTP_PORT, () => {
  console.log(` HTTP server running on port ${HTTP_PORT}`);
});

p2pServer.listen(P2P_PORT);
console.log(` P2P server listening on port ${P2P_PORT}`);


if (PEERS.length > 0) {
  console.log(`\n Connecting to ${PEERS.length} peer(s)...`);
  PEERS.forEach(peer => p2pServer.connectToPeer(peer));
} else {
  console.log("\n  No peers specified. Running as first node.");
}


setTimeout(() => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 Starting Blockchain Operations");
  console.log("=".repeat(50) + "\n");

  // Mine initial blocks
  console.log("🔨 Mining initial blocks to get coins...\n");
  blockchain.minePendingTransactions(myWalletAddress);
  console.log("   Block #1 mined");
  blockchain.minePendingTransactions(myWalletAddress);
  console.log("   Block #2 mined");

  const initialBalance = blockchain.getBalanceOfAddress(myWalletAddress);
  console.log(`\n💰 Initial Balance: ${initialBalance} coins\n`);

  // Create and broadcast transaction
  if (initialBalance >= 50) {
    console.log(" Creating transaction...\n");

    const receiverKey = ec.genKeyPair();
    const receiverAddress = receiverKey.getPublic('hex');
    
    console.log("   Receiver Address:", receiverAddress.substring(0, 20) + "...");
    console.log("   Amount: 50 coins\n");

    const tx = new Transaction(myWalletAddress, receiverAddress, 50);
    tx.signTransaction(myKey);

    try {
      blockchain.addTransaction(tx);
      console.log(" Transaction added to pending transactions");

      p2pServer.broadcastTransaction(tx);
      console.log(" Transaction broadcasted to peers\n");
    } catch (error) {
      console.error("❌ Transaction failed:", error.message);
      return;
    }

    // Mine the transaction
    console.log("🔨 Mining transaction block...\n");
    const minedBlock = blockchain.minePendingTransactions(myWalletAddress);
    p2pServer.broadcastNewBlock(minedBlock);
    console.log("✅ Block mined and broadcasted to peers\n");

    // Display balances
    const finalBalance = blockchain.getBalanceOfAddress(myWalletAddress);
    console.log(`💰 Final Balance: ${finalBalance} coins`);
    
    const receiverBalance = blockchain.getBalanceOfAddress(receiverAddress);
    console.log(`💰 Receiver Balance: ${receiverBalance} coins\n`);

    // Blockchain info
    console.log("=".repeat(50));
    console.log(" Blockchain Info");
    console.log("=".repeat(50));
    console.log(`Total Blocks: ${blockchain.chain.length}`);
    console.log(`Pending Transactions: ${blockchain.pendingTransactions.length}`);
    console.log(`Chain Valid: ${blockchain.ischainValid()}`);
    console.log("=".repeat(50) + "\n");

  } else {
    console.log(`❌ Insufficient balance (${initialBalance} coins). Need at least 50 coins.\n`);
  }

}, 2000);