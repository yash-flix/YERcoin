import SHA256 from "crypto-js/sha256.js";
import pkg from "elliptic";
const { ec } = pkg;

const EC = new ec('secp256k1');

class Transaction{
    constructor(fromAddress , toAddress , amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash()
    {
        return SHA256(this.fromAddress , this.toAddress , this.amount).toString();
    }
    signTransaction(signingKey) // signingKey is an object from elliptic library
    {
        if(signingKey.getPublic('hex')!== this.fromAddress)
        {
            throw new Error('You cannot sign transaction from other wallets!');
        }
        const hashTx = this.calculateHash();//hash of the current transaction
        const sig = signingKey.sign(hashTx , 'base64');
        this.signature = sig.toDER(); //signs the transaction
    }
    isValid()
    {
        if(this.fromAddress === null) return true;
        if(!this.signature || this.signature.length ==0)
        {
            throw new Error("No signature in this transaction");
        }
        const publicKey = EC.keyFromPublic(this.fromAddress , 'hex');// getting public key from the fromAddress
        return publicKey.verify(this.calculateHash() , this.signature); 
    }
}

export default Transaction;