import BigInteger from 'big-integer'
import crypto from 'crypto-js'

export default class Block {
    constructor(transtactions = [], previousHash = '', timestamp = Date.now()) {
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = BigInteger(0)
        this.timestamp = timestamp
        this.transactions = transtactions
    }

    calculateHash() {
        return crypto.SHA3(JSON.stringify(this.transactions) + this.timestamp + this.previousHash + this.nonce).toString()
    }

    addTransaction(transaction) {
        if (!transaction.isValid) {
            throw new Error('Invalid transaction')
        }
        this.transactions.push(transaction)
    }

    mineBlock(difficulty) {
        while (!this.hash.startsWith("0".repeat(difficulty))) {
            this.nonce += BigInteger(1);
            if (this.nonce % 5000 === 0) {
                console.log(this.nonce) // eslint-disable-line no-console
            }
            this.hash = this.calculateHash();
        }
    }

    hasValidTransactions(){
        for( let transaction of this.transactions ){
            if(!transaction.isValid()){
                return false
            }
        }
        return false
    }
}