import Block from './Block.js';
import Transaction from './Transaction.js';
import pkg from 'elliptic';
const { ec: EC } = pkg;

const ec = new EC('secp256k1');

class Blockchain
{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock()
    {
        return new Block("01/01/2026" , "Genesis Block" , "0");
    }
    getLatestBlock()
    {
        return this.chain[this.chain.length-1];

    }
    minePendingTransactions(minerAddress)
    {
        const rewardTx = new Transaction(null , minerAddress , this.miningReward);
        this.pendingTransactions.push(rewardTx);
        
        let block = new Block(Date.now() , this.pendingTransactions);
        block.prevHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty); // performs proof of work

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = [];
        return block;
    }

    addTransaction(transaction)
    {
        if(!transaction.fromAddress || !transaction.toAddress)
        {
            throw new Error("Transaction must include from and to address");
        }
        if(!transaction.isValid())
        {
            throw new Error("Cannot add invalid transaction to the chain")
        }

        const senderBalance = this.getBalanceOfAddress(transaction.fromAddress , true);
        if(senderBalance < transaction.amount)
        {
            throw new Error("Insufficient balance")
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address , includePending=false)
    {
        let balance = 0;
        for(const block of this.chain)
        {
            for(const trans of block.transactions)
            {
                if(trans.fromAddress === address)
                {
                    balance -= trans.amount;
                }
                if(trans.toAddress === address)
                {
                    balance += trans.amount;
                }
            }
            if(includePending)
            {
                for(const tx of this.pendingTransactions)
                {
                    if(tx.fromAddress == address)
                    {
                        balance -= tx.amount;
                    }
                }
            }
        }
        return balance;
    }

 ischainValid() 
 {
    for (let i = 1; i < this.chain.length; i++) {
    const currentBlock = this.chain[i];
    const previousBlock = this.chain[i - 1];

    // Transactions must be valid
    if (!currentBlock.hasValidTransaction()) {
      return false;
    }

    // Block must not be empty
    if (currentBlock.transactions.length === 0) {
      return false;
    }

    // Mining reward rules
    let rewardTxCount = 0;
    for (const tx of currentBlock.transactions) {
      if (tx.fromAddress === null) {
        rewardTxCount++;
        if (tx.amount !== this.miningReward) {  // Reward must be exactly 100 coins
          return false;
        }
      }
    }
    if (rewardTxCount !== 1) {
      return false;
    }

    // Proof of Work validation
    if (!currentBlock.hash.startsWith("0".repeat(this.difficulty))) {
      return false;
    }

    // Hash integrity
    if (currentBlock.hash !== currentBlock.calculateHash()) {
      return false;
    }

    // Chain linkage
    if (currentBlock.prevHash !== previousBlock.hash) {
      return false;
    }
  }
  return true;
}

}

let YERcoin = new Blockchain();


const myKey = ec.keyFromPrivate("44c0e75657dfe8ef3313b26f9d1c566eab44e94a4ad43e582f49513ef2ff9803");
const myWalletAddress = myKey.getPublic('hex'); // myKey = KEY OBJECT (contains both private + public, keep secret!)

// Mine first block to get initial balance
console.log("\nStarting the mining to get initial balance...")
YERcoin.minePendingTransactions(myWalletAddress);

console.log("\nBalance after first mine:", YERcoin.getBalanceOfAddress(myWalletAddress));

const tx1 = new Transaction(myWalletAddress , "public key goes here" , 10);
tx1.signTransaction(myKey);
YERcoin.addTransaction(tx1);

console.log("\nStarting the mining for transaction...")
YERcoin.minePendingTransactions(myWalletAddress);

console.log("\nBalance after transaction:", YERcoin.getBalanceOfAddress(myWalletAddress));


export default Blockchain;