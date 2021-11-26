'use strict';

const Manager = require("../Manager");
const RoleManager = require("./RoleManager");

class UserManager extends Manager {
    constructor(user, token, guildId = "") {
        let guildUser;

        if (guildId) {
            guildUser = user;
            user = user.user;
        }

        super(user, token);
        
        this.tag = `${this.username}#${this.discriminator}`;
        if (this.avatar || this.avatar == null) {
            this.avatarURL = "https://cdn.discordapp.com/";
            if (this.avatar == null) this.avatarURL += `embed/avatars/${this.discriminator % 5}.png`;
            else if (!guildUser) this.avatarURL += `avatars/${this.id}/${this.avatar}.png`;
            else this.avatarURL += `guilds/${guildId}/users/${this.id}/avatars/${this.avatar}.png`;
        }

        if (guildUser) {
            this.roles = new Array();
            this.mute = guildUser.mute;
            this.joined_at = guildUser.joined_at;
            this.hoisted_role = guildUser.hoisted_role;
            this.deaf = guildUser.deaf;

            guildUser.roles.forEach(role => this.roles.push(new RoleManager(role)));
        }
    }
}

module.exports = UserManager;
