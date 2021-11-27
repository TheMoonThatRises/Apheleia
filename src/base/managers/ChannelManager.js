'use strict';

const Manager = require("../Manager");
const Embed = require("../message/Embed");
const Message = require("../message/Message");
const CacheArray = require("../modifiers/CacheArray");

class ChannelManager extends Manager {
    constructor(channel, messageCacheSize, token) {
        super(channel, token);

        this.messageCache = new CacheArray(messageCacheSize);
    }

    async send(...message) {
        let data = {
            "content": "",
            "embeds": [
                
            ],
            message_reference: this.replyContent ?? null
        }

        if (typeof message == "object" && message.content) data = message;
        else if (message instanceof Embed) data.embeds.push(message);
        else {
            for (const content of message) {
                if (content instanceof Embed) data.embeds.push({...content});
                else if (typeof content == "string") data.content += content + "\n";
            }
        }

        const sendReq = {
            method: 'post',
            url: this.baseHTTPURL + `channels/${(!(this instanceof Message)) ? this.id : this.channel.id}/messages`,
            headers: this.headers,
            data: data
        };

        return await this.axios(sendReq)
            .catch(err => {
                if (err.response.data.retry_after) setTimeout(() => this.send(data), err.response.data.retry_after);
                else throw new Error(`Unable to send message:\n\n${err}`);
            });
    }
}

module.exports = ChannelManager;