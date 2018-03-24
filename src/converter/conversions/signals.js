const Template = require("../templates/Template").Template;

/**
 * @param {Class} clazz
 * @return {string}
 */
function processSignals(clazz) {
    const classSignals = clazz.getAllSignals();
    if (classSignals.length === 0)
        return "";

    let signals = classSignals.map(signal => {
        return {
            documentation: signal.getDocumentation().split("\n").concat(["@type {__SignalType}"]),
            name: signal.getName(),
            definition: "null"
        }
    });

    return Template.variableAssignment({
        documentation: null,
        signature: null,
        prefix: "this",
        variable: "signal",
        assignment: Template.literalObject(signals)
    });
}

exports.processSignals = processSignals;