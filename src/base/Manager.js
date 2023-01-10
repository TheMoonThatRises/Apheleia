const Base = require("./Base");

module.exports = class Manager extends Base {
  constructor(object = {}, token = "", baseEndpoint = "") {
    if (Object.keys(object).length <= 0)
      throw new Error("Object must have at least one value.");

    super(token, baseEndpoint);
    Object.assign(this, object);
  }
};
