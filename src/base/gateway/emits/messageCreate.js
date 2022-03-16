const Message = require("../../message/messages/Message");

module.exports = async (client, message) => {
  const modifiedMessage = new Message(message, client);
  if (client.options.cacheBotMessage || !modifiedMessage.author.bot)
    client.channels.get(message.channel_id).messageCache.push(modifiedMessage);
  return modifiedMessage;
};
