/* eslint-disable no-useless-constructor */
// StickerManager will have functions but will add later

const Manager = require("../Manager");

class StickerManager extends Manager {
  constructor(stickerObject = {}, token = "") {
    super(stickerObject, token);
  }
}

module.exports = StickerManager;
