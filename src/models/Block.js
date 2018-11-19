import BigInteger from 'big-integer'
import crypto from 'crypto-js'

export default class Block {
    constructor(transtactions = [], previousHash = '', timestamp) {
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = BigInteger(0)
        this.timestamp = timestamp
        this.transactions = transtactions
    
    }

    calculateHash() {
        return crypto.SHA3(JSON.stringify(this.transactions) + this.timestamp + this.previousHash + this.nonce).toString()
    }
}