import SHA256 from "crypto-js/sha256.js";
import Transaction from './Transaction.js';

class Block
{
    constructor(timestamp , transactions , prevHash='')
    {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash= this.calculateHash();
        this.nonce = 0;
    }

    calculateHash()
    {
        return SHA256( this.timestamp + JSON.stringify(this.transactions) + this.prevHash + this.nonce).toString();
    }
    mineBlock(difficulty) // proof of work
    {
        while(this.hash.substring(0,difficulty)!= Array(difficulty+1).join("0"))
        {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
        
    }
    hasValidTransaction()
    {
        for(const Tx of this.transactions)
        {
            if(!Tx.isValid())
            {
                return false;
            }
        }
        return true;
    }
}
export default Block;