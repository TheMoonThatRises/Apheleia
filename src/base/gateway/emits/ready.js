const UserManager = require("../../managers/UserManager");
const ApplicationManager = require("../../managers/ApplicationManager");

module.exports = async (client, ready) => {
  if (client.options.oauth2CacheSelf) {
    Object.assign(ready.user, await client.api("oauth2/applications/@me"));
  }

  client.user = new UserManager(ready.user, client.token);
  client.sessionID = ready.session_id;
  client.applications = new ApplicationManager(client.token, ready.user.id);

  if (client.options.forceCacheApplicationCommands) {
    const globalCommands = await client.api(
      `${client.applications.selfBaseHTTPURL}commands`
    );
    await globalCommands.forEach((command) =>
      client.applications.cache.set(command.id, command)
    );

    client.guilds.forEach(async (guild) => {
      client.applications.guilds.set(guild.id, new Map());
      const guildCommands = await client.api(
        `${client.applications.selfBaseHTTPURL}guilds/${guild.id}/commands`
      );
      await guildCommands.forEach((command) =>
        client.applications.guilds.get(guild.id).set(command.id, command)
      );
    });
  }

  return ready;
};
