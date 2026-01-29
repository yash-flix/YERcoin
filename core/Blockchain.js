import Block from './Block.js';
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
        let block = new Block(Date.now() , this.pendingTransactions);
        block.prevHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null , miningRewardAddress , this.miningReward)
        ];
    }

    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address)
    {
        let balance = 0;
        for(const block of this.chain)
        {
            for(const trans of block.transactions)
            {
                if(block.fromAddress === address)
                {
                    balance -= trans.amount;
                }
                if(block.toAddress === address)
                {
                    balance += trans.amount;
                }
                
            }
        }
        return balance;
    }
    isValidBlock()
    {
        for(let i =0 ; i<this.chain.length;i++)
        {
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[i-1];

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
// console.log("Is the block chain valid?" + YERcoin.isValidBlock()); 

//tempering the chain
//YERcoin.chain[1].data = {amount : 100};
// console.log("Is the block chain valid?" + YERcoin.isValidBlock()); -> false , tempering detected 

// console.log(JSON.stringify(YERcoin , null , 4));


YERcoin.createTransaction(new Transaction('address1' , 'address2' , 100));
YERcoin.createTransaction(new Transaction('address2' , 'address1' , 50));

console.log("/n Starting the mining...")
YERcoin.minePendingTransactions("xaviers-address");

console.log("\n Balance of Xavier is" , YERcoin.getBalanceOfAddress("xaviers-address"));

console.log("/n Starting the mining again...")
YERcoin.minePendingTransactions("xaviers-address"); 
console.log("\n Balance of Xavier is" , YERcoin.getBalanceOfAddress("xaviers-address"));

export default Blockchain;