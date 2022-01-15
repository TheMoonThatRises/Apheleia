"use strict";

const Manager = require("../Manager");
const RoleManager = require("./RoleManager");

class UserManager extends Manager {
    constructor(userObject = {}, token = "", guildId = "") {
        if (Object.keys(userObject).length <= 0) throw new Error("UserObject must have at least one value.");
        else if (guildId && (typeof guildId != "string" && typeof guildId != "bigint")) throw new Error("GuildId must be a string or bigint.");

        let {user} = userObject;

        if (!user) user = userObject;

        super(user, token);

        this.tag = `${this.username}#${this.discriminator}`;

        if (this.avatar || this.avatar == null) {
            this.avatarURL = "https://cdn.discordapp.com/";
            if (this.avatar == null) this.avatarURL += `embed/avatars/${this.discriminator % 5}.png`;
            else if (!userObject.user) this.avatarURL += `avatars/${this.id}/${this.avatar}.png`;
            else this.avatarURL += `guilds/${guildId}/users/${this.id}/avatars/${this.avatar}.png`;
        }

        if (userObject.user) {
            this.roles = [];
            this.mute = userObject.mute;
            // Camel-cases will be removed later
            this.joined_at = userObject.joined_at; // eslint-disable-line camelcase
            this.hoisted_role = userObject.hoisted_role; // eslint-disable-line camelcase
            this.deaf = userObject.deaf;

            userObject.roles.forEach(role => this.roles.push(new RoleManager(role, token)));
        } else if (this.owner) this.owner = new UserManager(this.owner, this.token);
    }
}

module.exports = UserManager;