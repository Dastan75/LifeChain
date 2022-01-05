import crypto from 'crypto';

export default class Block {
    hash = ''
    noonce = 0
    timestamp = Date.now()
    transactions = []
    previousHash = ""
    rewardWallet = null
    merkelRoot = ""
    constructor(timestamp = Date.now(), transactions, previousHash = '', rwallet) {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.rewardWallet = rwallet
        this.merkelRoot = this.getMerketRoot()
    }


    
    calculateHash() {
        const preHashData = this.rewardWallet + this.merkelRoot + this.previousHash + this.timestamp + this.noonce + JSON.stringify(this.transactions)
        const hash = crypto.createHash('sha256').update(preHashData).digest('base64');
        return hash
    }

    getMerketRoot() {
        const preHashData = JSON.stringify(this.transactions)
        const hash = crypto.createHash('sha256').update(preHashData).digest('base64');
        return hash
    }

    verifyMerkel(hashM) {
        const preHashData = JSON.stringify(this.transactions)
        const hash = crypto.createHash('sha256').update(preHashData).digest('base64');
        return hash === hashM
    }

    getHash() {
        return this.hash
    }

    mineBlock(difficulty) {
        const strDifficulty = Array(difficulty + 1).join("0")
        while(this.hash.substring(0, difficulty) !== strDifficulty) {
            this.noonce += 1
            this.hash = this.calculateHash()
        }

        console.log("New block mined !", this.hash)
    }

    hasValidTransaction() {
        for(const transaction of this.transactions){
            if (!transaction.isValid()) {
                return false
            }
        }
        return true
    }

}