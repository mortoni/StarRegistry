const level = require('level');
const hex2ascii = require('hex2ascii');

const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    getLevelDBData(key){
        let self = this;
        return new Promise((resolve, reject) => {
            self.db.get(key, (err, value) => {
                if (err) reject(err);
                resolve(value);
            })
        });
    }

    addLevelDBData(key, value) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.db.put(key, value, (err) => {
                if (err) reject(err);
                resolve(value);
            })
        });
    }

    getBlocksCount() {
        let self = this;
        let count = 0;
        return new Promise((resolve, reject) => {
            self.db.createReadStream()
                .on('data', (data) => count++)
                .on('error', (err) => reject(err))
                .on('close', () => resolve(count));
        });
    }

    getBlockByHash(hash) {        
        let self = this;
        let block = null;
        return new Promise((resolve, reject) => {
            self.db.createReadStream()
            .on('data', (data) => {
                const object = JSON.parse(data.value);
                
                if(object.hash === hash) {
                    object.body.star.storyDecoded =  hex2ascii(object.body.star.story);
                    block = object;
                }
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('close', () => {
                resolve(block);
            });
        });
    }

    getBlockByWalletAddress(address) {
        let self = this;
        let blocks = [];
        return new Promise((resolve, reject) => {
            self.db.createReadStream()
            .on('data', (data) => {
                const object = JSON.parse(data.value);

                if(object.body.address === address) {
                    object.body.star.storyDecoded =  hex2ascii(object.body.star.story);
                    blocks.push(object);
                }
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('close', () => {
                resolve(blocks);
            });
        });
    }

    getBlockByHeight(height) {
        let self = this;
        let block = null;
        return new Promise((resolve, reject) => {
            self.db.createReadStream()
            .on('data', (data) => {
                const object = JSON.parse(data.value);
                
                if(object.height == height) {
                    object.body.star.storyDecoded =  hex2ascii(object.body.star.story);
                    block = object;
                }
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('close', () => {
                resolve(block);
            });
        });
    }
}

module.exports.LevelSandbox = LevelSandbox;