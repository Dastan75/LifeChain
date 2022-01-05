import crypto from 'crypto';

export default class Transaction {
    constructor(fromWall, toWall, amount) {
        this.fromWallet = fromWall
        this.toWallet = toWall
        this.amount = amount
    }

    calculateHash() {
        const preHashData = this.fromWallet.publicKey + this.toWallet.publicKey + this.amount
        return crypto.createHash('sha256').update(preHashData).digest('base64');
    }

    signTransaction(signingWallet) {
        if (signingWallet.publicKey !== this.fromWallet.publicKey) {
            throw new Error("Wrong wallet for this transaction !")
        }
        const hashTx = this.calculateHash()
        this.signature = signingWallet.getSignature(hashTx)
    }

    isValid() {
        if(this.fromWallet === null) return true 

        if(!this.signature || this.signature.length === 0){
            throw new Error("No signature for this transaction")
        }

        const verify = crypto.createVerify('SHA256');
        verify.write(this.calculateHash());
        verify.end();
        return verify.verify(this.fromWallet.getPublicKeyObj(), this.signature, this.fromWallet.encodingType);
    }
}