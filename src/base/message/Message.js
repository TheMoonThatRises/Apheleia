'use strict';

const Manager = require("../Manager");
const UserManager = require("../managers/UserManager");

class Message extends Manager {
    constructor(message, client, token) {
        super(message, token);
        
        this.guild = client.guilds.get(message.guild_id);
        this.channel = client.channels.get(message.channel_id);
        
        this.author = (this.guild.members.get(message.author.id)) ? this.guild.members.get(message.author.id) : new UserManager(this.author);

        this.replyContent = {
            message_id: this.id, 
            guild_id: this.guild.id, 
            channel_id: this.channel.id
        };
    }

    async reply(message) {
        return await this.channel.send.bind(this)(message);
    }
}

module.exports = Message;