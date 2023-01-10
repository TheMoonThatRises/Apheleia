const Constructor = require("../../Constructor");

module.exports = class ActionRow extends Constructor {
  constructor(...components) {
    super();

    this.type = 1;
    this.components = [...components];
  }
};
