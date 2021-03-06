const Manager = require("../Manager");
const UserManager = require("./UserManager");

class EmojiManager extends Manager {
  constructor(emojiObject = {}, token = "") {
    super(emojiObject, token);

    this.content = `<${this.animated ? "a:" : ""}${this.name}:${this.id}>`;
    if (this.user) this.user = new UserManager(this.user, token);
  }
}

module.exports = EmojiManager;
