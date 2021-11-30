"use strict";

const Manager = require("../Manager");
const ChannelManager = require("./ChannelManager");
const EmojiManager = require("./EmojiManager");
const RoleManager = require("./RoleManager");
const StickerManager = require("./StickerManager");
const UserManager = require("./UserManager");

class GuildManager extends Manager {

    /**
     * Complete documentation of the guild data structure: https://discord.com/developers/docs/resources/guild#guild-object-guild-structure
     */
    constructor(guildObject, client) {
        super(guildObject, client.token);

        this.roles = new Map();
        this.members = new Map();
        this.channels = new Map();
        this.emojis = new Map();
        this.stickers = new Map();


        guildObject.roles.forEach(role => this.roles.set(role.id, new RoleManager(role, this.token)));
        guildObject.members.forEach(member => this.members.set(member.user.id, new UserManager(member, this.token, guildObject.id)));
        guildObject.channels.forEach(channel => this.channels.set(channel.id, new ChannelManager(channel, client.options.messageCacheSize, this.token)));
        guildObject.emojis.forEach(emoji => this.emojis.set(emoji.id, new EmojiManager(emoji, this.token)));
        guildObject.stickers.forEach(sticker => this.stickers.set(sticker.id, new StickerManager(sticker, this.token)));
    }
}

module.exports = GuildManager;