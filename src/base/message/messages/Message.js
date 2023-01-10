const MenuConstructor = require("../interactions/MenuConstructor");
const Manager = require("../../Manager");
const UserManager = require("../../managers/UserManager");
const ActionRow = require("../interactions/ActionRow");
const ButtonConstructor = require("../interactions/ButtonConstructor");
const Embed = require("./Embed");

module.exports = class Message extends Manager {
  static ReplyContent = class {
    constructor(messageId, guildId, channelId) {
      this.message_id = messageId;
      this.guild_id = guildId;
      this.channel_id = channelId;
    }
  };

  constructor(messageObject, client) {
    super(messageObject, client.token);

    this.channel = client.channels.get(messageObject.channel_id);
    this.guild = client.guilds.get(messageObject.guild_id);

    if (!this.guild) {
      client.guilds.forEach((guild) => {
        if (guild.channels.get(this.channel.id)) this.guild = guild;
      });
    }

    this.author =
      this.guild.members.get(messageObject.author.id) ??
      new UserManager(this.author);

    this.replyContent = new Message.ReplyContent(
      this.id,
      this.guild.id,
      this.channel.id
    );

    this.reply = (...message) =>
      this.channel.send(...message, this.replyContent);
    this.delete = () => this.channel.api(`messages/${this.id}`, {}, "delete");
  }

  static constructMessage(...message) {
    let data = {
      content: "",
      embeds: [],
      components: [],
      message_reference: null,
    };

    if (typeof message === "object" && message.content) data = message;
    else if (message instanceof Embed) data.embeds.push(message);
    else {
      for (const content of message) {
        if (content instanceof Embed) data.embeds.push({ ...content });
        else if (typeof content === "string") data.content += `${content}\n`;
        else if (content instanceof Message.ReplyContent)
          data.message_reference = content;
        else if (content instanceof ActionRow) data.components.push(content);
        else if (
          content instanceof ButtonConstructor ||
          content instanceof MenuConstructor
        )
          data.components.push(new ActionRow(content));
        else if (typeof content === "object") {
          for (const [key, value] of Object.entries(content)) data[key] = value;
        }
      }
    }

    if (!data.content && data.components[0])
      throw new Error("Content required for message components.");

    return data;
  }
};
