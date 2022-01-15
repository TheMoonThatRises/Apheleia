"use strict";

const Base = require("../Base");
const SlashCommand = require("../message/interactions/SlashCommand");

class ApplicationManager extends Base {
    constructor(token, clientID) {
        super(token, `applications/${clientID}/`);

        this.cache = new Map();
        this.guilds = new Map();
    }

    async create(slashCommand = new SlashCommand(), guildID = 0) {
        let endpoint = this.selfBaseHTTPURL;
        if (guildID) {
            if (typeof guildID != "bigint" && typeof guildID != "string") throw new Error("Guild id must be a bigint or string.");
            else endpoint = `guilds/${guildID}/`;
        }

        endpoint += "commands";

        return await this.api(endpoint, slashCommand, "post");
    }
}

module.exports = ApplicationManager;