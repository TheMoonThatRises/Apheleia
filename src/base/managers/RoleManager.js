'use strict';

const Manager = require("../Manager");

class RoleManager extends Manager {
    constructor(roles, token) {
        if (typeof roles == "object") super(roles, token);
        else super({id: roles}, token);
    }
}

module.exports = RoleManager;