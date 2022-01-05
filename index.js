
import Blockchain from './src/blockchain.js'
import Transaction from './src/transaction.js'
import Wallet from './src/wallet.js'
import Core from './src/core.js'


const AppCore = new Core()
process.core = AppCore
const seasonCoin = new Blockchain(3)

const walletIvy = new Wallet("Ivy wallet")
const walletFlo = new Wallet("Flo wallet")
const walletMiner = new Wallet("Miner")


// seasonCoin.createTransaction(new Transaction('address1', 'address2', 100))
// seasonCoin.createTransaction(new Transaction('address1', 'address2', 50))
// seasonCoin.createTransaction(new Transaction('address1', 'address2', 10))

const TX1 = new Transaction(walletIvy, walletFlo, 100)
const TX2 = new Transaction(walletIvy, walletFlo, 10)
const TX3 = new Transaction(walletIvy, walletFlo, 1)

TX1.signTransaction(walletIvy)
TX2.signTransaction(walletIvy)
TX3.signTransaction(walletIvy)


seasonCoin.addTransaction(TX1)

seasonCoin.minePendingTransactions(walletMiner)

seasonCoin.addTransaction(TX2)

seasonCoin.minePendingTransactions(walletMiner)

seasonCoin.addTransaction(TX3)

seasonCoin.export()
console.info("Exported!")

console.log(seasonCoin.getAllBlocks())
// console.log("IVY balance:", seasonCoin.getBalanceofAddress("ivy-address"))
// console.log("address1:", seasonCoin.getBalanceofAddress("address1"))

console.info("Starting Mining...")

setInterval(function(){
    seasonCoin.minePendingTransactions(walletMiner)
}, 1000)