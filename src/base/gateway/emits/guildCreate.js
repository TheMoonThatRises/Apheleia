const GuildManager = require("../../managers/GuildManager");
const ChannelManager = require("../../managers/ChannelManager");
const UserManager = require("../../managers/UserManager");

module.exports = async (client, guild) => {
  if (client.options.forceCacheGuildOnJoin)
    client.guilds.set(guild.id, new GuildManager(guild, client));
  if (client.options.forceCacheChannelOnJoin)
    guild.channels.forEach((channel) =>
      client.channels.set(
        channel.id,
        new ChannelManager(
          channel,
          client.options.messageCacheSize,
          client.token
        )
      )
    );
  if (client.options.forceCacheMembersOnJoin)
    guild.members.forEach((member) =>
      !client.users.get(member.user.id)
        ? client.users.set(
            member.user.id,
            new UserManager(member.user, client.token)
          )
        : null
    );
  return guild;
};
