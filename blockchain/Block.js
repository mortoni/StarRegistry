class Block {
    constructor(data){
        const { address, dec, ra, story } = data;

        this.hash = '',
        this.height = 0,
        this.body = {
            address,
            star: {
                dec,
                ra,
                story: Buffer(story).toString('hex'),
            },
        },
        this.time = 0,
        this.previousBlockHash = ''
    }
}

module.exports.Block = Block;
