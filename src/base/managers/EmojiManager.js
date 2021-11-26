'use strict';

const Manager = require("../Manager");

class EmojiManager extends Manager {
    constructor(emoji, token) {
        super(emoji, token);
    }
}

module.exports = EmojiManager;