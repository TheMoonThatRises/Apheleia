"use strict";

const Manager = require("../Manager");
const UserManager = require("../managers/UserManager");
const Embed = require("./Embed");

class Message extends Manager {
    static ReplyContent = class {
        constructor(messageId, guildId, channelId) {
            this.message_id = messageId; // eslint-disable-line camelcase
            this.guild_id = guildId; // eslint-disable-line camelcase
            this.channel_id = channelId; // eslint-disable-line camelcase
        }
    };

    constructor(messageObject, client) {
        super(messageObject, client.token);

        this.guild = client.guilds.get(messageObject.guild_id);
        this.channel = client.channels.get(messageObject.channel_id);

        this.author = (this.guild.members.get(messageObject.author.id)) ? this.guild.members.get(messageObject.author.id) : new UserManager(this.author);

        this.replyContent = new Message.ReplyContent(this.id, this.guild.id, this.channel.id);

        this.reply = (...message) => this.channel.send(...message, this.replyContent);
        this.delete = () => this.channel.api(`messages/${this.id}`, {}, "delete");
    }

    static constructMessage(...message) {
        let data = {
            "content": "",
            "embeds": [],
            message_reference: null // eslint-disable-line camelcase
        };

        if (typeof message == "object" && message.content) data = message;
        else if (message instanceof Embed) data.embeds.push(message);
        else {
            for (const content of message) {
                if (content instanceof Embed) data.embeds.push({...content});
                else if (typeof content == "string") data.content += content + "\n";
                else if (content instanceof Message.ReplyContent) data.message_reference = content; // eslint-disable-line camelcase
            }
        }

        return data;
    }
}

module.exports = Message;