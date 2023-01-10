const Manager = require("../Manager");
const RoleManager = require("./RoleManager");

module.exports = class UserManager extends Manager {
  constructor(userObject = {}, token = "", guildId = "") {
    if (Object.keys(userObject).length <= 0) {
      throw new Error("UserObject must have at least one value.");
    } else if (
      guildId &&
      typeof guildId !== "string" &&
      typeof guildId !== "bigint"
    ) {
      throw new Error("GuildId must be a string or bigint.");
    }

    let { user } = userObject;

    if (!user) {
      user = userObject;
    }

    super(user, token);

    this.tag = `${this.username}#${this.discriminator}`;

    if (this.avatar || this.avatar == null) {
      this.avatarURL = "https://cdn.discordapp.com/";
      if (this.avatar == null) {
        this.avatarURL += `embed/avatars/${this.discriminator % 5}.png`;
      } else if (!userObject.user) {
        this.avatarURL += `avatars/${this.id}/${this.avatar}.png`;
      } else {
        this.avatarURL += `guilds/${guildId}/users/${this.id}/avatars/${this.avatar}.png`;
      }
    }

    if (userObject.user) {
      this.mute = userObject.mute;
      this.joined_at = userObject.joined_at;
      this.hoisted_role = userObject.hoisted_role;
      this.deaf = userObject.deaf;
      this.roles = {
        add: async (roleId) =>
          await this.api(
            `guilds/${guildId}/members/${this.id}/roles/${roleId}`,
            {},
            "put"
          ),
        remove: async (roleId) =>
          await this.api(
            `guilds/${guildId}/members/${this.id}/roles/${roleId}`,
            {},
            "delete"
          ),
        cache: new Map(),
      };

      this.kick = async () =>
        await this.api(`guilds/${guildId}/members/${this.id}`, {}, "delete");
      this.ban = async (days = 0, reason = "") =>
        await this.api(
          `guilds/${guildId}/bans/${this.id}`,
          { delete_message_days: days, reason },
          "put"
        );

      userObject.roles.forEach((role) =>
        this.roles.cache.set(role, new RoleManager(role, guildId, token))
      );
    } else if (this.owner) {
      this.owner = new UserManager(this.owner, this.token);
    }
  }
};
