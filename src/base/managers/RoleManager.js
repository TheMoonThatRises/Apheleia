const Manager = require("../Manager");

module.exports = class RoleManager extends Manager {
  constructor(roleObject = {}, guildId = "", token = "") {
    const role = {};
    if (typeof roleObject === "string") {
      role.id = roleObject;
    } else {
      Object.assign(role, roleObject);
    }

    super(role, token, `guilds/${guildId}/roles`);

    this.delete = async () => await this.api(this.id, {}, "delete");
    this.position = async (position) =>
      await this.api("", { id: this.id, position }, "patch");
  }
};
