const EventEmitter = require("node:events");

class Base extends EventEmitter {
  constructor(token = "", baseEndpoint = "") {
    if (!token || (typeof token !== "string" && typeof token !== "bigint"))
      throw new Error("Token must be a string or bigint.");

    super();

    const discordApiVersion = 9;

    Object.defineProperties(this, {
      discordApiVersion: {
        value: discordApiVersion,
        writable: false,
      },
      baseHTTPURL: {
        value: `https://discord.com/api/v${discordApiVersion}/`,
        writable: false,
      },
      selfBaseHTTPURL: {
        value: `https://discord.com/api/v${discordApiVersion}/${baseEndpoint}`,
        writable: false,
      },
      axios: {
        value: require("axios"),
        writable: false,
      },
      ws: {
        value: require("ws"),
        writable: false,
      },
      headers: {
        value: {
          Authorization: `Bot ${token}`,
        },
        writable: false,
      },
      token: {
        value: token,
        writable: false,
      },
    });
  }

  async api(endpoint = "", data = {}, method = "get") {
    if (!method) throw new Error("Method required.");

    const sendReq = {
      method,
      url:
        (!endpoint.includes(this.baseHTTPURL) ? this.selfBaseHTTPURL : "") +
        endpoint,
      headers: this.headers,
    };

    if (Object.keys(data).length > 0) sendReq.data = { ...data };

    return (await this.axios(sendReq).catch((err) => {
      if (err.response.status === 429)
        setTimeout(() => this.send(data), err.response.data.retry_after);
      else if (err.response.status === 403)
        throw new Error("Forbidden request.");
      else if (err.response.status === 401)
        throw new Error("Unauthorized request.");
      else if (err.response.status === 404)
        throw new Error("Endpoint not found.");
      else throw new Error(`Unable to send api request:\n\n${err}`);
    })).data;
  }
}

module.exports = Base;
