"use strict";

const Manager = require("../Manager");

class RoleManager extends Manager {
    constructor(roleObject, token) {
        if (typeof roleObject == "object") super(roleObject, token);
        else super({id: roleObject}, token);
    }
}

module.exports = RoleManager;