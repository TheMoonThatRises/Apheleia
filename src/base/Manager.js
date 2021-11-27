'use strict';

const Base = require('./Base');

class Manager extends Base {
    constructor(object, token, baseEndpoint = "") {
        super(token, baseEndpoint);
        Object.assign(this, object);
    }
}

module.exports = Manager;