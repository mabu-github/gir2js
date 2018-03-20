const processDocumentation = require('./documentation.js').processDocumentation;
const getValidJsPropertyName = require("./property").getValidJsPropertyName;

/**
 * @param {Class} clazz
 * @returns {string}
 */
exports.processSignals = function(clazz) {
    let signalProto = "{ connect: function(connectTo) {}, disconnect: function(disconnectFrom) {}, emit: function() {} }";

    let signals = "";
    const classSignals = clazz.getSignals();
    if (classSignals.length > 0) {
        signals = "this.signal = {";
        signals += classSignals.map(function (signal) {
            return processDocumentation(signal.getData()) + getValidJsPropertyName(signal.getName()) + ": " + signalProto;
        }).join(",\n");
        signals += "};\n";
    }

    return signals;
};