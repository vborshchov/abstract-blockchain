import Block from './Block'

export default class Chain {
    constructor() {
        this.blocks = [this.createGenesisBlock()]
    }

    createGenesisBlock() {
        return new Block(null, null, Date.now())
    }
}