import crypto from 'crypto-js'
import EC from 'elliptic/lib/elliptic/ec';

export default class Transaction {
    constructor({from, to, amount, signature}) {
        this.from = from
        this.to = to
        this.amount = amount
        this.signature = signature
    }

    calculateHash() {
        return crypto.SHA3(this.from + this.to + this.amount).toString()
    }

    async sign(signKeyPair) {
        return new Promise((resolve, reject) => {
            if (signKeyPair.getPublic('hex') !== this.from) {
                reject('You can not sign transaction from another wallet');
            }
            let hashTransaction = this.calculateHash()
            let sig = signKeyPair.sign(hashTransaction, 'hex')
            this.signature = sig.toDER('hex')
            return resolve(this.signature);
        })

    }

    isValid() {
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction')
        }
        const ec = new EC('secp256k1');
        let publicKey = ec.keyFromPublic(this.from, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}