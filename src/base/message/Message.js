'use strict';

const Manager = require("../Manager");
const UserManager = require("../managers/UserManager");
const Embed = require("./Embed");

class Message extends Manager {
    static ReplyContent = class {
        constructor(messageId, guildId, channelId) {
            this.message_id = messageId;
            this.guild_id = guildId;
            this.channel_id = channelId;
        }
    }

    constructor(message, client) {
        super(message, client.token);
        
        this.guild = client.guilds.get(message.guild_id);
        this.channel = client.channels.get(message.channel_id);
        
        this.author = (this.guild.members.get(message.author.id)) ? this.guild.members.get(message.author.id) : new UserManager(this.author);

        this.replyContent = new Message.ReplyContent(this.id, this.guild.id, this.channel.id);

        this.reply = (...message) => this.channel.send(...message, this.replyContent);
        this.delete = () => this.channel.api(`messages/${this.id}`, {}, 'delete');
    }

    static async constructMessage(...message) {
        let data = {
            "content": "",
            "embeds": [],
            message_reference: null
        }

        if (typeof message == "object" && message.content) data = message;
        else if (message instanceof Embed) data.embeds.push(message);
        else {
            for (const content of message) {
                if (content instanceof Embed) data.embeds.push({...content});
                else if (typeof content == "string") data.content += content + "\n";
                else if (content instanceof Message.ReplyContent) data.message_reference = content;
            }
        }

        return data;
    }
}

module.exports = Message;