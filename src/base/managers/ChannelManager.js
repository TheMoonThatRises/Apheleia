'use strict';

const Manager = require("../Manager");
const CacheArray = require("../modifiers/CacheArray");
const Message = require("../message/Message");

class ChannelManager extends Manager {
    constructor(channel, messageCacheSize, token) {
        super(channel, token, `channels/${channel.id}/`);

        this.messageCache = new CacheArray(messageCacheSize);

        this.send = async (...message) => await this.api('messages', await Message.constructMessage(...message), 'post');
    }
}

module.exports = ChannelManager;