'use strict';

const EventEmitter = require('events');

class Base extends EventEmitter {
    constructor(token) {
        super();
        this.baseHTTPURL = "https://discord.com/api/v9/";
        this.axios = require('axios');
        this.ws = require('ws');
        this.headers = {
            "Authorization": `Bot ${token}`
        };
    }
}

module.exports = Base;