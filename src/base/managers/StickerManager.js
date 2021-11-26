'use strict';

const Manager = require("../Manager");

class StickerManager extends Manager {
    constructor(sticker, token) {
        super(sticker, token);
    }
}

module.exports = StickerManager;