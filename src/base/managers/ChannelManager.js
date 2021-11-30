"use strict";

const Manager = require("../Manager");
const CacheArray = require("../modifiers/CacheArray");
const Message = require("../message/Message");

class ChannelManager extends Manager {
    constructor(channelObject, messageCacheSize, token) {
        super(channelObject, token, `channels/${channelObject.id}/`);

        this.messageCache = new CacheArray(messageCacheSize);

        this.send = async (...message) => await this.api("message", await Message.constructMessage(...message), "post");
    }
}

module.exports = ChannelManager;