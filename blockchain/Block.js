class Block {
    constructor(data){
        data.star.story = Buffer(data.star.story).toString('hex');

        this.hash = '',
        this.height = 0,
        this.body = data,
        this.time = 0,
        this.previousBlockHash = ''
    }
}

module.exports = Block;
