"use strict";

const Constructor = require("../../Constructor");

class ActionRow extends Constructor {
    constructor(...components) {
        super();

        this.type = 1;
        this.components = [...components];
    }
}

module.exports = ActionRow;