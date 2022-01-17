const EmitTypes = require("./EmitTypes");

class EmitManager {
  static async manage(data, client, callback) {
    const options = data.d;
    const modified = await callback(options);

    client.emit(EmitTypes[data.t], modified);
  }
}

module.exports = EmitManager;
