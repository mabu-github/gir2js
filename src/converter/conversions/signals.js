const processDocumentation = require('./documentation.js').processDocumentation;
const getValidJsPropertyName = require("./property").getValidJsPropertyName;

exports.processSignals = function(clazz) {
    if (!clazz['glib:signal']) return "";

    let signalProto = "{ connect: function(connectTo) {}, disconnect: function(disconnectFrom) {}, emit: function() {} }";

    let signals = "this.signal = {";
    signals += clazz['glib:signal'].map(function (signal) {
        return processDocumentation(signal) + getValidJsPropertyName(signal.$.name) + ": " + signalProto;
    }).join(",\n");
    signals += "};\n";

    return signals;
};