'use strict';

const ChannelManager = require("../managers/ChannelManager");
const Base = require("../Base");
const UserManager = require("../managers/UserManager");
const GuildManager = require("../managers/GuildManager");
const EmitManager = require("./EmitManager");
const Message = require("../message/Message");
const Intents = require("./Intents");
const EmitTypes = require("./EmitTypes");

class Client extends Base {
    constructor(token = "", options = {"intents": [Intents.ALL], "forceCacheMembersOnJoin": true, "forceCacheMemberOnMessage": false, "forceCacheGuildOnJoin": true, "forceCacheChannelOnJoin": true, "forceCacheChannelOnMake": false, "forceWaitGuildCache": false, "oauth2CacheSelf": false}) {
        if (!token) throw new Error("Token not provided.");
        else if (typeof token != "string") throw new Error("Token must be a string.");

        super(token);

        this.options = Object.assign({"intents": [Intents.ALL], "forceCacheMembersOnJoin": true, "forceCacheMemberOnMessage": false, "forceCacheGuildOnJoin": true, "forceCacheChannelOnJoin": true, "forceCacheChannelOnMake": false, "forceWaitGuildCache": false, "oauth2CacheSelf": false}, options);

        if (this.options.intents.length <= 0) throw new Error("Intents requried.");

        this.options.intents = Number(this.options.intents.reduce((a, b) => a + b));

        this.guilds = new Map();
        this.users = new Map();
        this.channels = new Map();

        this.on("READY", data =>
            EmitManager.manage(data, this, async options => {
                if (this.options.oauth2CacheSelf) Object.assign(options.user, (await this.api('oauth2/applications/@me')).data)
                this.user = new UserManager(options.user, this.token);
                this.sessionID = options.session_id;
                return options;
            })
        );

        this.on("GUILD_CREATE", data => {
            EmitManager.manage(data, this, guild => {
                this.guilds.set(guild.id, new GuildManager(guild, this.token));
                guild.channels.forEach(channel =>  this.channels.set(channel.id, new ChannelManager(channel, this.token)));
                guild.members.forEach(member => (!this.users.get(member.user.id) ? this.users.set(member.user.id, new UserManager(member.user, this.token)) : null));  
                return guild;  
            }); 
        });

        this.on("MESSAGE_CREATE", data =>
            EmitManager.manage(data, this, message => {
                return new Message(message, this.guilds.get(message.guild_id), this.channels.get(message.channel_id), this.token)
            })
        );
    }

    async login() {
        const getGateway = {
            method: 'get',
            url: this.baseHTTPURL + "gateway/bot",
            headers: this.headers
        };

        const gatewayResponse = await this.axios(getGateway)
            .catch(err => { throw new Error(`Getting gateway error:\n\n${err}`) });

        this.WSSURL = `${gatewayResponse.data.url}/?v=9&encoding=json`;

        this.connection = new this.ws(this.WSSURL);

        this.connection.onmessage = message => {
            const data = JSON.parse(message.data);
            switch (data.op) {
                case 0:
                    let modifiedEmit = (!this._events[data.t]) ? EmitTypes[data.t] : data.t;
                    this.emit(modifiedEmit, (modifiedEmit != data.t) ? data.d : data);
                    this.seq = data.s;
                    break;
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
                    }, ((Math.random() * 4) + 1) * 1000);
                case 10:
                    this.heartbeatInterval = data.d.heartbeat_interval * (Math.random() + 0.5);
                    
                    // Sending Heartbeat
                    this.heartbeat();
                    
                    // Identifying client
                    this.identify();
                    break;
            }
        }

        this.connection.onerror = error => { throw new Error(`Websocket Error:\n\n${error}`) };
    }

    async heartbeat() {
        this.iheartbeat = setInterval(() => {
            this.connection.send(JSON.stringify({
                "op": 1,
                "d": this.seq ?? null
            }));
        }, this.heartbeatInterval);
    }

    async identify() {
        this.connection.send(JSON.stringify({
            "op": 2,
            "d": {
              "token": this.token,
              "intents": this.options.intents,
              "compress": false,
              "properties": {
                "$os": process.platform,
                "$broconnectioner": process.env.npm_package_name,
                "$device": process.env.npm_package_name
              }
            }
        }));
    }

    async reconnect() {
        this.connection.send(JSON.stringify({
            "op": 6,
            "d": {
                "token": this.token,
                "session_id": this.sessionID,
                "seq": this.seq
            }
        }));
    }

    async api(endpoint = "", data = {}, method = "get") {
        const sendReq = {
            method: method,
            url: this.baseHTTPURL + endpoint,
            headers: this.headers
        };

        sendReq ||= data;

        return await this.axios(sendReq)
            .catch(err => {
                if (err.response.data.retry_after) setTimeout(() => this.send(data), err.response.data.retry_after);
                else throw new Error(`Unable to send message:\n\n${err}`);
            });
    }
}

module.exports = Client;