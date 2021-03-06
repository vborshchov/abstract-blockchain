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

    async mineAndAddBlock(transactions) {
        const begin = performance.now();
        let block = new Block();
        transactions.forEach(function(transaction) {
            block.addTransaction(transaction);
        });
        let previousBlock = this.getPreviousBlock();
        block.previousHash = previousBlock.hash;
        return block.mineBlock(this.difficulty).then(() => {
            const end = performance.now();
            const diff = end - begin;

            console.log({ time: diff, difficulty: this.difficulty }); // eslint-disable-line no-console
            if (diff < MINE_TIME_PERIOD) {
                this.difficulty += 1;
            } else {
                this.difficulty -= 1;
            }
            this.blocks.push(block)
            return this.blocks;
        })
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

    getAddressBalance(address, blocksNumber = this.blocks.length) {
        let balance = 0
        for (let i = 1; i <= blocksNumber; i++) { //skip genesis block
            for (const transaction of this.blocks[i].transactions) {
                if (transaction.from === address)
                    balance -= transaction.amount;
                if (transaction.to === address)
                    balance += transaction.amount;
            }
        }
        return balance;
    }

    
}