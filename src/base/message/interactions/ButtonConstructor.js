"use strict";

const Constructor = require("../../Constructor");

class ButtonConstructor extends Constructor {
    static PRIMARY = 1;

    static SECONDARY = 2;

    static SUCCESS = 3;

    static DANGER = 4;

    static LINK = 5;

    static options = {"style": ButtonConstructor.PRIMARY, "label": "", "emoji": {}, "custom_id": "", "url": "", "disabled": false};

    constructor(button = ButtonConstructor.options) {
        super(ButtonConstructor.options, button);

        this.type = 2;
    }

    setStyle(style = ButtonConstructor.PRIMARY) {
        if (typeof style != "number" && typeof style != "string") throw new Error("Style must be either a number or string.");
        else if (Number(style) < ButtonConstructor.PRIMARY || Number(style) > ButtonConstructor.LINK) throw new Error("Style must be between 1 and 5");

        this.style = Number(style);

        return this;
    }

    setLabel(text = "") {
        this.label = String(text);

        return this;
    }

    setCustomId(id = "") {
        this.custom_id = String(id); // eslint-disable-line camelcase

        return this;
    }

    setLink(url = "") {
        this.url = String(url);

        return this;
    }

    setDisabled(disabled = false) {
        if (typeof disabled != "boolean") throw new Error("Disabled must be boolean.");

        this.disabled = disabled;

        return this;
    }
}

module.exports = ButtonConstructor;