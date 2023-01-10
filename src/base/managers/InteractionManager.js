const Manager = require("../Manager");
const UserManager = require("./UserManager");
const Message = require("../message/messages/Message");

module.exports = class InteractionManager extends Manager {
  constructor(interaction = {}, client = {}) {
    interaction.data.id = interaction.id;
    interaction.data.token = interaction.token;
    delete interaction.token;
    delete interaction.id;

    super(interaction, client.token);

    this.member = new UserManager(
      interaction.member,
      this.token,
      interaction.guild_id
    );
    this.channel = client.channels.get(interaction.channel_id);
    this.guild = client.guilds.get(interaction.guild_id);
    if (this.message) {
      client.message = new Message(interaction.message, client);
    }

    this.baseWebhook = `webhooks/${client.user.id}/${interaction.data.token}/messages/`;
    this.baseInteraction = `interactions/${interaction.data.id}/${interaction.data.token}/callback`;

    this.followupMessageId = null;

    this.respond = async (...message) =>
      await this.api(
        this.baseInteraction,
        { type: 4, data: Message.constructMessage(...message) },
        "post"
      );
    this.editResponse = async (...message) =>
      await this.api(
        `${this.baseWebhook}@original`,
        Message.constructMessage(...message),
        "patch"
      );
    this.defer = async () =>
      await this.api(
        this.baseInteraction,
        { type: interaction.data.name ? 5 : 6 },
        "post"
      );
    this.deleteResponse = async () =>
      await this.api(`${this.baseWebhook}@original`, {}, "delete");
    this.updateComponent = async (...message) =>
      await this.api(
        this.baseInteraction,
        { type: 7, data: Message.constructMessage(...message) },
        "post"
      );
    this.getOriginal = async () =>
      await this.api(`${this.baseWebhook}@original`, {}, "get");
    this.followup = async (...message) => {
      const req = await this.api(
        this.baseWebhook.replace("/messages/", ""),
        Message.constructMessage(...message),
        "post"
      );
      this.followupMessageId = req.data.id;
      return req;
    };
    this.editFollowup = async (...message) =>
      await this.api(
        this.baseWebhook + this.followupMessageId,
        Message.constructMessage(...message),
        "patch"
      );
    this.deleteFollowup = async () =>
      await this.api(this.baseWebhook + this.followupMessageId, {}, "delete");
    this.getFollowup = async () =>
      await this.api(this.baseWebhook + this.followupMessageId, {}, "get");
  }
};
