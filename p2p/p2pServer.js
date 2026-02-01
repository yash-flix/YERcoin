// p2p/p2pServer.js
import WebSocket, { WebSocketServer } from "ws";

const MESSAGE_TYPES = {
  NEW_BLOCK: "NEW_BLOCK", //when someone mines a block
  NEW_TRANSACTION : "NEW_TRANSACTION" //when someone creates a new transaction
};

function createP2PServer(blockchain) {
  const sockets = []; //Stores all active WebSocket connections

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
    if(message.type === MESSAGE_TYPES.NEW_TRANSACTION)
    {
        handleTranction(message.data);
    }
  }
//handles a new block
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
  //handles the incoming transaction
  function handleTranction(transaction)
  {
    try{
        blockchain.addTransaction(transaction);
        console.log("New transaction added to pending transactions");
    }catch(err)
    {
        console.log("Transaction rejected: " + err);
    }
  }
//braodcasts the new block to all peers
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
  //broadcasts the new transaction to all peers
function broadcastTransaction(transaction)
{
    sockets.forEach(socket=>{
        socket.send(
            JSON.stringify({
                type:MESSAGE_TYPES.NEW_TRANSACTION,
                data : transaction
            })
        );
    });
}
 
  return {
    listen,
    connectToPeer,
    broadcastNewBlock,
    broadcastTransaction
  };
}

export default createP2PServer;