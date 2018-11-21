import Block from './Block'

const MINE_TIME_PERIOD = 1000

export default class Chain {

    constructor() {
        this.blocks = [this.createGenesisBlock()]
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(null, null, Date.now())
    }

    getPreviousBlock() {
        return this.blocks[this.blocks.length - 1];
    }

    mineAndAddBlock(transactions) {
        const begin = performance.now();
        let block = new Block();
        transactions.forEach(function(transaction) {
            block.addTransaction(transaction);
        });
        let previousBlock = this.getPreviousBlock();
        block.previousHash = previousBlock.hash;
        block.mineBlock(this.difficulty);
        const end = performance.now();
        const diff = end - begin;

        console.log({ time: diff, difficulty: this.difficulty });
        if (diff < MINE_TIME_PERIOD) {
            this.difficulty += 1;
        } else {
            this.difficulty -= 1;
        }
        this.blocks.push(block)
    }

    isValid() {
        for (let i = 0; i < this.block.length; i++) {
            const current = this.block[i]
            const prev = this.block[i - 1]
            if (current.hash !== current.calculateHash())
                return false;
            if (current.previousHash !== prev.hash)
                return false;
        }
        return true;
    }

    getAddressBalance(address) {
        let balance = 0
        for (const block of this.blocks) {
            for (const transaction of block.transactions) {
                if (transaction.from === address)
                    balance -= transaction.amount;
                if (transaction.to === address)
                    balance += transaction.amount;
            }
        }
        return balance;
    }

    
}