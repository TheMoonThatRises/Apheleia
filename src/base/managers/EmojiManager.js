"use strict";

const Manager = require("../Manager");
const RoleManager = require("./RoleManager");

class EmojiManager extends Manager {
    constructor(emojiObject, token) {
        super(emojiObject, token);

        this.roles = [];

        this.content = `<${this.animated ? "a:" : ""}${this.name}:${this.id}>`;

        emojiObject.roles.forEach(role => this.roles.push(new RoleManager(role, token)));
    }
}

module.exports = EmojiManager;