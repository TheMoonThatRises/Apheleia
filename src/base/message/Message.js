'use strict';

const Manager = require("../Manager");
const UserManager = require("../managers/UserManager");

class Message extends Manager {
    constructor(message, guild, channel, token) {
        super(message, token);
        
        this.guild = guild;
        this.channel = channel;
        
        this.author = (guild.members.get(message.author.id)) ? guild.members.get(message.author.id) : new UserManager(this.author);
    }
}

module.exports = Message;