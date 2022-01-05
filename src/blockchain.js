import Block from './block.js'
// const fs = require('fs');
// import * as fs from 'fs';
import fs from 'fs'
import Transaction from './transaction.js'

export default class Blockchain {
    #chain = [this.createGenesisBlock()]
    #dbPath = 'dbBlockchain.chain'
    difficulty = 1
    pendingTransaction = []
    miningReward = 500

    constructor(difficulty) {
        this.difficulty = difficulty
    }


    createGenesisBlock() {
        let genBlock = new Block(Date.now(), "Genesis block", "Genesis Hash", {})
        genBlock.hash = genBlock.calculateHash()
        return genBlock
    }

    getLatestBlock() {
        return this.#chain[this.#chain.length - 1]
    }

    getAllBlocks() {
        return this.#chain
    }

    minePendingTransactions(miningRewardAddress) {
        console.log(`Transactions waiting: ${this.pendingTransaction.length}`)
        if (this.pendingTransaction.length < 3) {
            console.warn('Aborted, not enough transactions waiting!')
            return
        }

        let pendingTransactionTmp = [
            this.pendingTransaction.shift(),
            this.pendingTransaction.shift(),
            this.pendingTransaction.shift()                
        ]
        let block = new Block(Date.now(), pendingTransactionTmp, this.getLatestBlock().hash, miningRewardAddress)
        block.mineBlock(this.difficulty)
        this.#chain.push(block)
        // this.pendingTransaction= [
        //     new Transaction(null, miningRewardAddress, this.miningReward)
        // ]
    }

    addTransaction(transaction) {
        if (!transaction.fromWallet || !transaction.toWallet) {
            throw new Error('Transaction invalid, missing wallet.')
        }

        if (!transaction.isValid()) {
            throw new Error('Transaction invalid, add failed.')
        }

        this.pendingTransaction.push(transaction)
    }

    getBalanceofAddress(address) {
        let balance = 0
        for (const block of this.#chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount
                }
                if (transaction.toAddress === address) {
                    balance += transaction.amount
                }
            }
        }
        return balance
    }

    isChainValid() {
        for (let index = 1; index < this.#chain.length; index += 1) {
            const currentBlock = this.#chain[index];
            const previousBlock = this.#chain[index - 1];

            if (!currentBlock.hasValidTransaction()) {
                return false
            }

            if (currentBlock.getHash() !== currentBlock.calculateHash()) {
                return false
            }

            if (currentBlock.previousHash !== previousBlock.getHash()) {
                return
            }
        }
        return true
    }

    export() {
        try {
            if (fs.existsSync(this.#dbPath)) {
                fs.unlinkSync(this.#dbPath) // remove file if exist
            }
        } catch (err) {
            console.error(err)
        }
        for (const elem of this.#chain) {
            fs.appendFileSync(this.#dbPath, JSON.stringify(elem), { flag: 'a+' }, err => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }


    }

    import(path) {
        try {
            const data = fs.readFileSync(this.#dbPath, 'base64')
            console.log("Import data:", data)
        } catch (err) {
            console.error(err)
        }
    }


}