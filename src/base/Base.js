'use strict';

const EventEmitter = require('events');

class Base extends EventEmitter {
    constructor(token) {
        super();

        Object.defineProperties(this, {
            "baseHTTPURL": {
                "value": "https://discord.com/api/v9/",
                "writable": false
            },
            "axios": {
                "value": require('axios'),
                "writable": false
            },
            "ws": {
                "value": require('ws'),
                "writable": false
            },
            "headers": {
                "value": {
                    "Authorization": `Bot ${token}`
                },
                "writable": false
            },
            "token": {
                "value": token,
                "writable": false
            }
        });
    }
}

module.exports = Base;