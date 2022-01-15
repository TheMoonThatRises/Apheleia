"use strict";

const Manager = require("../Manager");
const CacheArray = require("../modifiers/CacheArray");
const Message = require("../message/messages/Message");

class ChannelManager extends Manager {
    constructor(channelObject = {}, messageCacheSize = 10, token = "") {
        if (messageCacheSize <= 0) throw new Error("MessageCacheSize must be larger than 0.");

        super(channelObject, token, `channels/${channelObject.id}/`);

        this.messageCache = new CacheArray(messageCacheSize);

        this.send = async (...message) => await this.api("messages", Message.constructMessage(...message), "post");
        this.delete = async () => await this.api(this.selfBaseHTTPURL.substring(0, this.selfBaseHTTPURL.length - 1), {}, "delete");
    }
}

module.exports = ChannelManager;