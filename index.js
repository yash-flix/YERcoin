
import Blockchain from "./core/Blockchain.js";
import P2PServer from "./p2p/p2pServer.js";
import app from "./app.js";

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const P2P_PORT = process.env.P2P_PORT || 5001;
const PEERS = process.env.PEERS ? process.env.PEERS.split(",") : [];

const blockchain = new Blockchain();
const p2pServer = createP2PServer(blockchain);

// Start servers
app.listen(HTTP_PORT, () => {
  console.log(` HTTP server running on port ${HTTP_PORT}`);
});

p2pServer.listen(P2P_PORT);

// Connect to peers
PEERS.forEach(peer => p2pServer.connectToPeer(peer));

const minedBlock = blockchain.minePendingTransactions("miner-address");
p2pServer.broadcastNewBlock(minedBlock);