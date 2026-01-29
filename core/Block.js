import SHA256 from "crypto-js/sha256.js";

class Block
{
    constructor(index , timestamp , data , prevHash='')
    {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash= this.calculateHash();
    }

    calculateHash()
    {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data)).toString();
    }
}
export default Block;