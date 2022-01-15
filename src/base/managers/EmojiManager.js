"use strict";

const Manager = require("../Manager");
const RoleManager = require("./RoleManager");
const UserManager = require("./UserManager");

class EmojiManager extends Manager {
    constructor(emojiObject = {}, token = "") {
        super(emojiObject, token);

        this.roles = [];

        this.content = `<${this.animated ? "a:" : ""}${this.name}:${this.id}>`;
        if (this.user) this.user = new UserManager(this.user, token);

        emojiObject.roles.forEach(role => this.roles.push(new RoleManager(role, token)));
    }
}

module.exports = EmojiManager;