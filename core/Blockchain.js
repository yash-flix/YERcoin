import Block from './Block.js';
class Blockchain
{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];

    }

    createGenesisBlock()
    {
        return new Block("0" ,"01/01/2026" , "Genesis Block" , "0");
    }
    getLatestBlock()
    {
        return this.chain[this.chain.length-1];

    }
    addBlock(newBlock)
    {
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);

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
YERcoin.addBlock(new Block(1 ,"02/01/2026" , {amount: 4}));
YERcoin.addBlock(new Block(2 ,"03/01/2026" , {amount: 10}));

// console.log("Is the block chain valid?" + YERcoin.isValidBlock());

console.log(JSON.stringify(YERcoin , null , 4));
export default Blockchain;