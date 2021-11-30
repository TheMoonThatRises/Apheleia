"use strict";

class CacheArray extends Array {
    constructor(cacheSize) {
        super();

        this.cacheSize = cacheSize;
    }

    push(item) {
        super.push(item);

        if (this.length > this.cacheSize) this.pop();

        return this;
    }
}

module.exports = CacheArray;