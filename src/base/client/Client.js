const fs = require("node:fs");
const Base = require("../Base");
const EmitTypes = require("../gateway/EmitTypes");
const EmitManager = require("../EmitManager");
const Presence = require("./Presence");

module.exports = class Client extends Base {
  static ClientOptions = {
    intents: [],
    forceCacheMembersOnJoin: true,
    forceCacheMemberOnMessage: false,
    forceCacheGuildOnJoin: true,
    forceCacheChannelOnJoin: true,
    forceCacheChannelOnMake: true,
    oauth2CacheSelf: false,
    messageCacheSize: 10,
    cacheBotMessage: false,
    forceCacheApplicationCommands: true,
    offlineMemberThreshold: 50,
  };

  constructor(token = "", options = Client.ClientOptions) {
    super(token);

    this.options = Object.assign(Client.ClientOptions, options);

    if (this.options.intents.length <= 0) {
      throw new Error("Intents requried.");
    }

    this.options.intents = Number(
      this.options.intents.reduce((addTo, add) => addTo + add)
    );

    this.guilds = new Map();
    this.users = new Map();
    this.channels = new Map();

    this.heartbeat = () =>
      (this.iheartbeat = setInterval(
        () => this.sendGatewayEvent(1, this.seq ?? null),
        this.heartbeatInterval
      ));
    this.identify = () =>
      this.sendGatewayEvent(2, {
        token: this.token,
        intents: this.options.intents,
        compress: false,
        large_threshold: this.options.offlineMemberThreshold,
        properties: {
          $os: process.platform,
          $browser: process.env.npm_package_name,
          $device: process.env.npm_package_name,
        },
      });
    this.reconnect = () =>
      this.sendGatewayEvent(6, {
        token: this.token,
        session_id: this.sessionID,
        seq: this.seq,
      });

    this.presence = new Presence(this);

    this.eventListeners();
  }

  async login() {
    const getGateway = {
      method: "get",
      url: `${this.baseHTTPURL}gateway/bot`,
      headers: this.headers,
    };

    this.gatewayResponse = (
      await this.axios(getGateway).catch((err) => {
        throw new Error(`Getting gateway error:\n\n${err}`);
      })
    ).data;

    this.WSSURL = `${this.gatewayResponse.url}/?v=${this.discordApiVersion}&encoding=json`;

    this.connection = new this.ws.WebSocket(this.WSSURL);

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
        case 1:
          this.heartbeatInterval = data.d.heartbeat_interval;
          clearInterval(this.iheartbeat);
          this.heartbeat();
          break;
        case 7:
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
          this.heartbeatInterval = data.d.heartbeat_interval;

          setTimeout(() => {
            // Sending Heartbeat
            this.heartbeat();

            // Identifying client
            this.identify();
          }, this.heartbeatInterval * Math.random());
          break;
        default:
          break;
      }
    };

    this.connection.onerror = (error) => {
      throw new Error(`Websocket Error:\n\n${error}`);
    };
  }

  sendGatewayEvent(op = -1, data = {}) {
    if (this.connection && this.connection._readyState === 1) {
      this.connection.send(
        JSON.stringify({
          op: op,
          d: data,
        })
      );
    }
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
};
