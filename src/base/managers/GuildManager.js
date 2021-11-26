'use strict';

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
    constructor(guild, token) {
        super(guild, token);

        this.roles = new Map();
        this.members = new Map();
        this.channels = new Map();
        this.emojis = new Map();
        this.stickers = new Map();


        guild.roles.forEach(role => this.roles.set(role.id, new RoleManager(role, token)));
        guild.members.forEach(member => this.members.set(member.user.id, new UserManager(member, token, guild.id)));
        guild.channels.forEach(channel => this.channels.set(channel.id, new ChannelManager(channel, token)));
        guild.emojis.forEach(emoji => this.emojis.set(emoji.id, new EmojiManager(emoji, token)));
        guild.stickers.forEach(sticker => this.stickers.set(sticker.id, new StickerManager(sticker, token)));
    }
}

module.exports = GuildManager;