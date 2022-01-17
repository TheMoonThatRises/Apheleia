const Constructor = require("../../Constructor");

class MenuConstructor extends Constructor {
  static Options = class extends Constructor {
    static options = {
      label: "",
      value: "",
      description: "",
      emoji: {},
      default: false,
    };

    static emoji = { name: "", id: "", animated: false };

    constructor(options = MenuConstructor.Options.options) {
      super();

      Object.assign(options, MenuConstructor.Options.options);
      Object.assign(this, options);
    }

    setLabel(text = "") {
      this.label = String(text);

      return this;
    }

    setValue(value = "") {
      this.value = String(value);

      return this;
    }

    setDescription(description = "") {
      this.description = String(description);

      return this;
    }

    setEmoji(emoji = MenuConstructor.Options.emoji) {
      Object.assign(emoji, MenuConstructor.Options.emoji);

      this.emoji = emoji;

      return this;
    }

    setDefault(isDefault = false) {
      this.default = Boolean(isDefault);

      return this;
    }
  };

  static options = {
    custom_id: "",
    options: [],
    placeholder: "",
    min_values: 1,
    max_values: 1,
    disabled: false,
  };

  constructor(menu = MenuConstructor.options) {
    super(MenuConstructor.options, menu);

    this.type = 3;
  }

  setCustomId(id = "") {
    this.custom_id = String(id); // eslint-disable-line camelcase

    return this;
  }

  addOption(option = MenuConstructor.Options) {
    if (!(option instanceof MenuConstructor.Options))
      throw new Error("Option must be instance of MenuConstructor.Options.");

    this.options.push(option);

    return this;
  }

  setPlaceholder(text = "") {
    this.placeholder = String(text);

    return this;
  }

  setMinValues(min = 1) {
    this.min_vales = Number(min); // eslint-disable-line camelcase

    return this;
  }

  setMaxValues(max = 1) {
    this.max_values = Number(max); // eslint-disable-line camelcase

    return this;
  }

  setDisabled(isDisabled = false) {
    this.disabled = Boolean(isDisabled);

    return this;
  }
}

module.exports = MenuConstructor;
