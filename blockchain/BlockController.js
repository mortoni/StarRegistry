const Mempool = require('./Mempool');
const Util = require('./Util');
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

let blockChain = new BlockChain.Blockchain();
let util = new Util.Util();
let mempool = new Mempool.Mempool();

class BlockController {
    constructor(app) {
        this.app = app;
        this.blocks = [];
        
        this.getBlockByHash();
        this.getBlockByHeight();
        this.getBlockByWalletAddress();
        this.addRequestValidation();
        this.validateMessageSignature();
        this.addBlock();
        this.validateChain();
    }

    setupMessage(req) {
        return `${req.walletAddress}:${req.requestTimeStamp}:starRegistry`;
    }

    addRequestValidation() {
        this.app.post('/requestValidation', (req, res) => {
            const { address } = req.body;
            if (address) {
                if(!mempool.isRequestValid(address)) {
                    const request = {
                        requestTimeStamp: util.time(),
                        walletAddress: address,
                    };
                    request.message = this.setupMessage(request);
                    request.validationWindow = util.timeLeft(request);
                    mempool.addRequest(request);
                    res.json(request);
                } else {
                    res.json(mempool.getRequest(address));
                }
            } else {
                res.send('The request has no content!');
            }
        });
    }

    validateMessageSignature() {
        this.app.post('/message-signature/validate', (req, res) => {
            const { address, signature} = req.body;
            if (address && signature) {
                res.json(mempool.validateRequestByWallet(address, signature));
            } else {
                res.send('The request has no or content is missing!');
            }
        });
    }

    isStartObject(object) {
        return object.address && object.star.dec && object.star.ra && object.star.story;
    }

    addBlock() {
        this.app.post('/block', (req, res) => {
            if (this.isStartObject(req.body)) {
                if(mempool.isAddressValid(req.body.address)) {
                    let block = new Block(req.body);
                    blockChain.addBlock(block).then((result) => {
                        mempool.removeWalletAddress(result.body.address);
                        res.json(result);
                    }).catch((err) => res.json({ result: null }));
                } else {
                    res.send('The address is not valid!');
                }
                
            } else {
                res.send('The request has no or content is missing!');
            }
        });
    }

    getBlockByHash() {
        this.app.get('/stars/hash::hash', (req, res) => {
            const { hash } = req.params;
            if (hash) {
                blockChain.getBlockByHash(hash).then(block => {
                    res.json(block);
                }).catch((err) => res.json({ block: null }));
            } else {
                res.send('The request has no or content is missing!');
            }
        });
    }

    getBlockByWalletAddress() {
        this.app.get('/stars/address::address', (req, res) => {
            const { address } = req.params;
            if (address) {
                blockChain.getBlockByWalletAddress(address).then(blocks => {
                    res.json(blocks);
                }).catch((err) => res.json({ blocks: null }));
            } else {
                res.send('The request has no or content is missing!');
            }
        });
    }

    validateChain() {
        this.app.get("/validateChain", (req, res) => {

            blockChain.validateChain().then((errorLog) => {
            	if(errorLog.length > 0){
            		res.json({isValid: false});
            	} else {
            		res.json({isValid: true});
            	}
            }).catch((err) => res.json({ isValid: null }));
        });
    }

    getBlockByHeight() {
        this.app.get("/block/:height", (req, res) => {
            const { height } = req.params;
            blockChain.getBlockByHeight(height).then((block) => {
            	res.json(block);
            }).catch((err) => res.json({ block: null }));
        });
    }
}

module.exports = (app) => { return new BlockController(app);}
