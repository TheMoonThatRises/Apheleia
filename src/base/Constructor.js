module.exports = class Constructor {
  static emojiPartial = { name: "", id: "", animated: false };

  constructor(dOptions = {}, options = {}) {
    Object.assign(options, dOptions);
    Object.assign(this, options);
  }

  api(key = "", value = "") {
    if (!key || typeof key !== "string") {
      throw new Error("Key must be a string.");
    } else if (value === "") {
      throw new Error("Value must not be an empty string.");
    }

    this[key] = value;

    return this;
  }
};
