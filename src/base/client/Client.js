const ChannelManager = require("../managers/ChannelManager");
const Base = require("../Base");
const UserManager = require("../managers/UserManager");
const GuildManager = require("../managers/GuildManager");
const EmitManager = require("./EmitManager");
const Message = require("../message/messages/Message");
const ApplicationManager = require("../managers/ApplicationManager");
const Intents = require("./Intents");
const EmitTypes = require("./EmitTypes");
const InteractionManager = require("../managers/InteractionManager");

class Client extends Base {
  static clientOptions = {
    intents: [Intents.ALL],
    forceCacheMembersOnJoin: true,
    forceCacheMemberOnMessage: false,
    forceCacheGuildOnJoin: true,
    forceCacheChannelOnJoin: true,
    forceCacheChannelOnMake: true,
    oauth2CacheSelf: false,
    messageCacheSize: 10,
    cacheBotMessage: false,
    forceCacheApplicationCommands: true,
  };

  constructor(token = "", options = Client.clientOptions) {
    super(token);

    this.options = Object.assign(Client.clientOptions, options);

    if (this.options.intents.length <= 0) throw new Error("Intents requried.");

    this.options.intents = Number(
      this.options.intents.reduce((addTo, add) => addTo + add)
    );

    this.guilds = new Map();
    this.users = new Map();
    this.channels = new Map();

    this.modifiedListeners();
  }

  async login() {
    const getGateway = {
      method: "get",
      url: `${this.baseHTTPURL}gateway/bot`,
      headers: this.headers,
    };

    const gatewayResponse = await this.axios(getGateway).catch((err) => {
      throw new Error(`Getting gateway error:\n\n${err}`);
    });

    this.WSSURL = `${gatewayResponse.data.url}/?v=${this.discordApiVersion}&encoding=json`;

    this.connection = new this.ws(this.WSSURL);

    this.connection.onmessage = (message) => {
      const data = JSON.parse(message.data);
      switch (data.op) {
        case 0: {
          const modifiedEmit = !this._events[data.t]
            ? EmitTypes[data.t]
            : data.t;
          this.emit(modifiedEmit, modifiedEmit != data.t ? data.d : data);
          this.seq = data.s;
          break;
        }
        case 7:
          break;
        case 9:
          this.emit("error", `Invalid Session:\n\n${data}`);
          // Stops sending heartbeat
          clearInterval(this.iheartbeat);

          // Reidentifies after sometime between 1 - 5 seconds
          setTimeout(() => {
            this.identify();
            this.heartbeat();
          }, (Math.random() * 4 + 1) * 1000);
          break;
        case 10:
          this.heartbeatInterval =
            data.d.heartbeat_interval * (Math.random() + 0.5);

          // Sending Heartbeat
          this.heartbeat();

          // Identifying client
          this.identify();
          break;
        default:
          break;
      }
    };

    this.connection.onerror = (error) => {
      throw new Error(`Websocket Error:\n\n${error}`);
    };
  }

  heartbeat() {
    this.iheartbeat = setInterval(() => {
      this.connection.send(
        JSON.stringify({
          op: 1,
          d: this.seq ?? null,
        })
      );
    }, this.heartbeatInterval);
  }

  identify() {
    this.connection.send(
      JSON.stringify({
        op: 2,
        d: {
          token: this.token,
          intents: this.options.intents,
          compress: false,
          properties: {
            $os: process.platform,
            $broconnectioner: process.env.npm_package_name,
            $device: process.env.npm_package_name,
          },
        },
      })
    );
  }

  reconnect() {
    this.connection.send(
      JSON.stringify({
        op: 6,
        d: {
          token: this.token,
          session_id: this.sessionID,
          seq: this.seq,
        },
      })
    );
  }

  // Client action functions

  modifiedListeners() {
    this.on("READY", (data) =>
      EmitManager.manage(data, this, async (ready) => {
        if (this.options.oauth2CacheSelf)
          Object.assign(ready.user, await this.api("oauth2/applications/@me"));

        this.user = new UserManager(ready.user, this.token);
        this.sessionID = ready.session_id;
        this.applications = new ApplicationManager(this.token, ready.user.id);

        if (this.options.forceCacheApplicationCommands) {
          const globalCommands = await this.api(
            `${this.applications.selfBaseHTTPURL}commands`
          );
          await globalCommands.forEach((command) =>
            this.applications.cache.set(command.id, command)
          );

          this.guilds.forEach(async (guild) => {
            this.applications.guilds.set(guild.id, new Map());
            const guildCommands = await this.api(
              `${this.applications.selfBaseHTTPURL}guilds/${guild.id}/commands`
            );
            await guildCommands.forEach((command) =>
              this.applications.guilds.get(guild.id).set(command.id, command)
            );
          });
        }

        return ready;
      })
    );

    this.on("GUILD_CREATE", (data) =>
      EmitManager.manage(data, this, (guild) => {
        if (this.options.forceCacheGuildOnJoin)
          this.guilds.set(guild.id, new GuildManager(guild, this));
        if (this.options.forceCacheChannelOnJoin)
          guild.channels.forEach((channel) =>
            this.channels.set(
              channel.id,
              new ChannelManager(
                channel,
                this.options.messageCacheSize,
                this.token
              )
            )
          );
        if (this.options.forceCacheMembersOnJoin)
          guild.members.forEach((member) =>
            !this.users.get(member.user.id)
              ? this.users.set(
                  member.user.id,
                  new UserManager(member.user, this.token)
                )
              : null
          );
        return guild;
      })
    );

    this.on("MESSAGE_CREATE", (data) =>
      EmitManager.manage(data, this, (message) => {
        const modifiedMessage = new Message(message, this);
        if (this.options.cacheBotMessage || !modifiedMessage.author.bot)
          this.channels
            .get(message.channel_id)
            .messageCache.push(modifiedMessage);
        return modifiedMessage;
      })
    );

    this.on("GUILD_MEMBER_ADD", (data) =>
      EmitManager.manage(data, this, (member) => {
        const modifiedMember = new UserManager(
          member,
          this.token,
          this.member.guild.id
        );

        if (this.options.forceCacheMembersOnJoin)
          this.users.set(modifiedMember.id, modifiedMember);

        return modifiedMember;
      })
    );

    this.on("CHANNEL_CREATE", (data) =>
      EmitManager.manage(data, this, (channel) => {
        const modifiedChannel = new ChannelManager(
          channel,
          this.options.messageCacheSize,
          this.token
        );

        if (this.options.forceCacheChannelOnMake) {
          this.channels.set(modifiedChannel.id, modifiedChannel);
          this.guilds
            .get(modifiedChannel.guild_id)
            .channels.set(modifiedChannel.id, modifiedChannel);
        }

        return modifiedChannel;
      })
    );

    this.on("INTERACTION_CREATE", (data) =>
      EmitManager.manage(
        data,
        this,
        (interaction) => new InteractionManager(interaction, this)
      )
    );
  }
}

module.exports = Client;
