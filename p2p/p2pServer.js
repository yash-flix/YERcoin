// p2p/p2pServer.js
import WebSocket, { WebSocketServer } from "ws";

const MESSAGE_TYPES = {
  NEW_BLOCK: "NEW_BLOCK"
};

function createP2PServer(blockchain) {
  const sockets = [];

  function listen(port) {
    const server = new WebSocketServer({ port });
    console.log(` P2P server listening on port ${port}`);

    server.on("connection", socket => {
      connectSocket(socket);
    });
  }

  function connectToPeer(peerAddress) {
    const socket = new WebSocket(peerAddress);

    socket.on("open", () => {
      console.log(` Connected to peer ${peerAddress}`);
      connectSocket(socket);
    });
  }

  function connectSocket(socket) {
    sockets.push(socket);
    console.log(" New peer connected");

    socket.on("message", message => {
      const data = JSON.parse(message.toString());
      handleMessage(data);
    });
  }

  function handleMessage(message) {
    if (message.type === MESSAGE_TYPES.NEW_BLOCK) {
      handleNewBlock(message.data);
    }
  }

  function handleNewBlock(block) {
    const latestBlock = blockchain.getLatestBlock();

    if (block.prevHash !== latestBlock.hash) {
      console.log(" Invalid previous hash, rejecting block");
      return;
    }

    blockchain.chain.push(block);

    if (!blockchain.ischainValid()) {
      console.log(" Invalid block received, reverting");
      blockchain.chain.pop();
    } else {
      console.log(" New block accepted from peer");
    }
  }

  function broadcastNewBlock(block) {
    sockets.forEach(socket => {
      socket.send(
        JSON.stringify({
          type: MESSAGE_TYPES.NEW_BLOCK,
          data: block
        })
      );
    });
  }

 
  return {
    listen,
    connectToPeer,
    broadcastNewBlock
  };
}

export default createP2PServer;