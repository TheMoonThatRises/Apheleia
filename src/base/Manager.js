'use strict';

const Base = require('./Base');

class Manager extends Base {
    constructor(object, token) {
        super(token);
        Object.assign(this, object);
    }
}

module.exports = Manager;