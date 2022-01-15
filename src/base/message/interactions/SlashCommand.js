"use strict";

const Constructor = require("../../Constructor");

class SlashCommand extends Constructor {
    static Options = class extends Constructor {
        static options = {"name": "", "value": ""};

        constructor(options = SlashCommand.Options.options) {
            super(SlashCommand.Options.options, options);
        }

        setName(name = "") {
            this.name = String(name);

            return this;
        }

        setValue(value = "") {
            this.value = String(value);

            return this;
        }
    };

    static SUB_COMMAND = 1;

    static SUB_COMMAND_GROUP = 2;

    static STRING = 3;

    static INTEGER = 4;

    static BOOLEAN = 5;

    static USER = 6;

    static CHANNEL = 7;

    static ROLE = 8;

    static MENTIONABLE = 9;

    static NUMBER = 10;

    static PERMISSION_ROLE = 0;

    static PERMISSION_USER = 1;

    static options = {"name": "", "description": "", options: []};


    constructor(slashCommand = SlashCommand.options) {
        super(SlashCommand.options, slashCommand);

        this.type = 1;
    }

    setName(name = "") {
        this.name = String(name);
        return this;
    }

    setDescription(description = "") {
        this.description = String(description);
        return this;
    }

    addOptions(name = "", description = "", type = SlashCommand.STRING, required = true, ...choices) {
        for (const choice of choices) if (!(choice instanceof SlashCommand.Options)) throw new Error("Choices must be of type Choice.");
        if (typeof type != "number" && typeof type != "string") throw new Error("Type must either a number or a string.");
        else if (Number(type) < SlashCommand.SUB_COMMAND || Number(type) > SlashCommand.NUMBER) throw new Error("Type must be between 1 and 10.");

        this.options.push({
            "name": String(name),
            "description": String(description),
            "type": Number(type),
            "required": Boolean(required),
            "choices": [...choices]
        });

        return this;
    }

    addPermission(id = 0n, type = SlashCommand.PERMISSION_ROLE) {
        if (!this.permissions) this.permissions = [];

        if (typeof id != "bigint" && typeof id != "string") throw new Error("Id must be either a bigint or string.");
        else if (typeof type != "number" && typeof type != "string") throw new Error("Type must be either a number or string.");
        else if (Number(type) != 0 && Number(type) != 1) throw new Error("Type must be either 0 or 1.");

        this.permissions.push({
            "id": Number(id),
            "type": Number(type),
            "permission": true
        });

        return this;
    }
}

module.exports = SlashCommand;