const Constants = require('./Constants');

class Util {
    constructor() {}

    time() { return new Date().getTime().toString().slice(0, -3) }

    timeLeft(req) {
        let timeElapse = (this.time()) - req.requestTimeStamp;

        return ((5*60*1000)/1000) - timeElapse; //FIXME: setup a constant for 5*60*1000;
    }
}

module.exports.Util = Util;
