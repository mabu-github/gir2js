const processDocumentation = require('./documentation.js').processDocumentation;

exports.processSignals = function(clazz) {
    if (!clazz['glib:signal']) return "";

    let signals = "this.signal = {};\n";
    let signalProto = "{ connect: function(connectTo) {} }";

    clazz['glib:signal'].forEach(function (signal) {
        signals += processDocumentation(signal) +
            "this.signal['" + signal.$.name + "'] = " + signalProto + ";\n";
    });

    return signals;
};