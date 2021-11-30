/* eslint-disable no-useless-constructor */
// StickerManager will have functions but will add later
"use strict";

const Manager = require("../Manager");

class EmojiManager extends Manager {
    constructor(emojiObject, token) {
        super(emojiObject, token);
    }
}

module.exports = EmojiManager;