const ChannelManager = require("../../managers/ChannelManager");

module.exports = async (client, channel) => {
  const modifiedChannel = new ChannelManager(
    channel,
    client.options.messageCacheSize,
    client.token
  );

  if (client.options.forceCacheChannelOnMake) {
    client.channels.set(modifiedChannel.id, modifiedChannel);
    client.guilds
      .get(modifiedChannel.guild_id)
      .channels.set(modifiedChannel.id, modifiedChannel);
  }

  return modifiedChannel;
};
