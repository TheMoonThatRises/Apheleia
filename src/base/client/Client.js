const fs = require("node:fs");
const Base = require("../Base");
const Intents = require("./Intents");
const EmitTypes = require("../gateway/EmitTypes");
const EmitManager = require("../EmitManager");

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

    this.eventListeners();
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

  eventListeners() {
    const events = fs.readdirSync("./src/base/gateway/emits/", {
      withFileTypes: true,
    });

    for (const file of events) {
      const event = require("../gateway/emits/" + file.name);

      this.on(
        file.name
          .replace(".js", "")
          .split(/(?=[A-Z])/)
          .join("_")
          .toUpperCase(),
        (data) => EmitManager(data, this, event)
      );
    }
  }
}

module.exports = Client;
