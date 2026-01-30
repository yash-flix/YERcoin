import Block from './Block.js';
import Transaction from './Transaction.js';

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
    // addBlock(newBlock)
    // {
    //     newBlock.prevHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty)
    //     this.chain.push(newBlock);

    // }

    minePendingTransactions()
    {
        const rewardTx = new Transaction(null , minerAddress , this.miningReward);
        this.miningReward.push(rewardTx);
        
        let block = new Block(Date.now() , this.pendingTransactions);
        block.prevHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = [];
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
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address)
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
        }
        return balance;
    }
    ischainValid()
    {
        for(let i =0 ; i<this.chain.length;i++)
        {
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransaction())
            {
                return false;
            }

            if(currentBlock.hash != currentBlock.calculateHash())
            {
                return false;
            }
            if(currentBlock.prevHash != previousBlock.hash )
            {
                return false;
            }
        }
        return true;
    }

}

let YERcoin = new Blockchain();

// console.log("Mining Block 1...")
// YERcoin.addBlock(new Block(1 ,"02/01/2026" , {amount: 4}));
// console.log("Mining Block 2...")
// YERcoin.addBlock(new Block(2 ,"03/01/2026" , {amount: 10}));

//checking if the chains are contigious
// console.log("Is the block chain valid?" + YERcoin.ischainValid()); 

//tempering the chain
//YERcoin.chain[1].data = {amount : 100};
// console.log("Is the block chain valid?" + YERcoin.ischainValid()); -> false , tempering detected 

// console.log(JSON.stringify(YERcoin , null , 4));

const myKey = ec.keyFromPrivate("44c0e75657dfe8ef3313b26f9d1c566eab44e94a4ad43e582f49513ef2ff9803");
const myWalletAddress = myKey.getPublic('hex');

const tx1 = new Transaction(myWalletAddress , "public key goes here" , 10);
tx1.signTransaction(myKey);
YERcoin.addTransaction(tx1);

// YERcoin.createTransaction(new Transaction('address1' , 'address2' , 100));
// YERcoin.createTransaction(new Transaction('address2' , 'address1' , 50));

console.log("/n Starting the mining...")
YERcoin.minePendingTransactions(myWalletAddress);

console.log("\n Balance of Xavier is" , YERcoin.getBalanceOfAddress(myWalletAddress));

// console.log("/n Starting the mining again...")
// YERcoin.minePendingTransactions("xaviers-address"); 
// console.log("\n Balance of Xavier is" , YERcoin.getBalanceOfAddress("xaviers-address"));

export default Blockchain;