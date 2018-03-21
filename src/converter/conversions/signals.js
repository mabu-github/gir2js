const Template = require("../templates/Template").Template;

/**
 * @param {Class} clazz
 * @returns {string}
 */
exports.processSignals = function(clazz) {
    let signalProto = "{ connect: function(connectTo) {}, disconnect: function(disconnectFrom) {}, emit: function() {} }";

    const classSignals = clazz.getSignals();
    if (classSignals.length === 0)
        return "";

    let signals = classSignals.map(function (signal) {
        return {
            documentation: signal.getDocumentation().split("\n"),
            name: signal.getName(),
            definition: signalProto
        }
    });

    return Template.variableAssignment({
        documentation: null,
        signature: null,
        prefix: "this",
        variable: "signal",
        assignment: Template.literalObject(signals)
    });
};