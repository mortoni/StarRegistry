const Mempool = require('./Mempool');
const Util = require('./Util');
const BlockChain = require('./BlockChain.js');
const SHA256 = require('crypto-js/sha256');
const Block = require('./Block.js');

let blockChain = new BlockChain.Blockchain();
let util = new Util.Util();
let mempool = new Mempool.Mempool();

class BlockController {
    constructor(app) {
        this.app = app;
        this.blocks = [];
        
        this.addRequestValidation();
        this.validateMessageSignature();
        this.createStar();
        this.validateChain();
        this.getBlockByIndex();
        this.validateChain();
        this.getBlockHeight();
        this.isIndex();
    }

    setupMessage(req) {
        return `${req.walletAddress}:${req.requestTimeStamp}:starRegistry`;
    }

    isIndex(i) {
        return !isNaN(parseFloat(i)) && i >= 0;
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

    createStar() {
        this.app.post('/createStart', (req, res) => {
            const { address, dec, ra, story} = req.body;
            console.log(req.body);
            
            if (address && dec && ra && story) {
                const block = {
                    address: address,
                    star: {
                        dec: dec,
                        ra: ra,
                        story: Buffer(story).toString('hex'),
                    },
                };

                blockChain.addBlock(block);

                res.json(block);
            } else {
                res.send('The request has no or content is missing!');
            }
        });
    }

    getBlockByIndex() {
        this.app.get("/api/block/:index", (req, res) => {
            const { index } = req.params;

            if (!this.isIndex(index)) {
                res.send('The parameter is not valid!');
            } else {
                blockChain.getBlockHeight().then((maxHeight) => {
                    if (index <= maxHeight) {
                        blockChain.getBlock(index).then((block) => {
                            res.json(block);
                        }).catch((err) => console.log(err));
                    } else {
                        res.send(`The height(${index}) parameter is out of bounds`);
                    }
                });
            }
        });
    }

    validateChain() {
        this.app.get("/api/validateChain", (req, res) => {

            blockChain.validateChain().then((errorLog) => {
            	if(errorLog.length > 0){
            		res.json({isValid: false});
            	} else {
            		res.json({isValid: true});
            	}
            }).catch((error) => res.json({ isValid: null }));
        });
    }

    validateBlock() {
        this.app.get("/api/validateBlock/:index", (req, res) => {
            const { index } = req.params;

            if (!this.isIndex(index)) {
                res.send('The parameter is not valid!');
            } else {
                blockChain.validateBlock(index).then((valid) => {
                	res.json({ isValid: valid });
                }).catch((error) => res.json({ isValid: null }));
            }
        });

    }

    getBlockHeight() {
        this.app.get("/api/getBlockHeight", (req, res) => {
            blockChain.getBlockHeight().then((height) => {
            	res.json({ height });
            }).catch((err) => res.json({ height: null }));
        });
    }
    
}

module.exports = (app) => { return new BlockController(app);}
