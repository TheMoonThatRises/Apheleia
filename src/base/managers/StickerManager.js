/* eslint-disable no-useless-constructor */
// StickerManager will have functions but will add later

const Manager = require("../Manager");

module.exports = class StickerManager extends Manager {
  constructor(stickerObject = {}, token = "") {
    super(stickerObject, token);
  }
};
