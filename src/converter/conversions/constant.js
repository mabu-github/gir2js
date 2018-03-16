const processDocumentation = require("./documentation").processDocumentation;
const getDocblockSignatureForParameter = require("./documentation").getDocblockSignatureForParameter;
const getParameterType = require("./glibBasicTypes").getParameterType;

exports.processConstants = function(namespace) {
    if (!namespace.constant) return "";

    let constants = "";
    namespace.constant.forEach(function (constant) {
        constants += processDocumentation(constant, getDocblockSignatureForParameter("@type", constant));
        constants += fullyQualifiedEnumName = namespace.$.name + "." + constant.$.name + " = ";
        if (getParameterType(constant) === "string") {
            constants += '"' + constant.$.value + '"';
        } else {
            constants += constant.$.value;
        }
        constants += ";";
    });
    return constants;
};