const InteractionManager = require("../../managers/InteractionManager");

module.exports = async (client, interaction) =>
  new InteractionManager(interaction, client);
