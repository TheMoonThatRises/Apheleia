'use strict';

class EmitManager {
    static async manage(data, client, callback) {
        const options = data.d;
        const modified = await callback(options);

        let emitType = data.t.toLowerCase().split("_");
        if (emitType.length > 1) emitType[1] = emitType[1][0].toUpperCase() + emitType[1].slice(1);
        emitType = emitType.join("");

        client.emit(emitType, modified);
    }
}

module.exports = EmitManager;