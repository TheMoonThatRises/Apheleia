const EmitTypes = require("./gateway/EmitTypes");

module.exports = async (data, client, callback) => {
  const options = data.d;
  const modified = await callback(client, options);

  client.emit(EmitTypes[data.t], modified);
};
