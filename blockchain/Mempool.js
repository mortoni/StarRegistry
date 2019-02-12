const Util = require('./Util');
const bitcoinMessage = require('bitcoinjs-message'); 

let util = new Util.Util();

class Mempool {
    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
        this.mempoolValid = [];
    }

    isAddressValid(address) {
        const found = this.mempool.find(add => add.address === address);
        return found ? found : false;
    }

    isRequestValid(walletAddress) {
        const test = this.timeoutRequests[walletAddress];
        return test;
    }

    getRequest(walletAddress) {
        return {
            ...this.mempool[walletAddress],
            validationWindow: util.timeLeft(this.mempool[walletAddress]),
        }
    }

    removeValidationRequest(walletAddress) {
        this.timeoutRequests = this.timeoutRequests.filter(req => [req] !== walletAddress);
    }

    addRequest(request) {
        this.timeoutRequests[request.walletAddress] = setTimeout(() => { 
            this.removeValidationRequest(request.walletAddress) 
        }, 5*60*1000 );

        this.mempool[request.walletAddress] = request;
    }

    isWindowTime(walletAddress) {
        return util.timeLeft(this.mempool[walletAddress]) > 0;
    }

    validateRequestByWallet(walletAddress, signature) {
        if (this.mempool[walletAddress]) {
            const { message, requestTimeStamp } = this.mempool[walletAddress];

            if (this.isWindowTime(walletAddress)) {
                let isValid = bitcoinMessage.verify(message, walletAddress, signature);
                if (isValid) {
                    this.registerStar = true;
                    this.status = {
                        address: walletAddress,
                        requestTimeStamp: requestTimeStamp,
                        message: message,
                        validationWindow: util.timeLeft(this.mempool[walletAddress]),
                        messageSignature: isValid,
                    };

                    const object = {
                        registerStar: this.registerStar,
                        status: this.status,
                    }

                    this.mempoolValid.push(object);
                    this.removeValidationRequest(walletAddress);
                    return object;
                }
            }
            return false;
        }
        return false;
    }


}

module.exports.Mempool = Mempool;
