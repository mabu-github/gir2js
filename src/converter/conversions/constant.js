const processDocumentation = require("./documentation").processDocumentation;
const processDocumentation2 = require("./documentation").processDocumentation2;
const getDocblockSignatureForParameter = require("./documentation").getDocblockSignatureForParameter;
const getParameterType = require("./glibBasicTypes").getParameterType;
const Template = require('../templates/Template').Template;

exports.processConstants = function(namespace) {
    if (!namespace.constant) return "";

    let constants = "";
    namespace.constant.forEach(function (constant) {
        constants += Template.renderFile(Template.TPL_VARIABLE_ASSIGNMENT, {
            documentation: processDocumentation2(constant).split("\n"),
            signature: getDocblockSignatureForParameter("@type", constant, namespace.$.name).split("\n"),
            prefix: namespace.$.name,
            variable: constant.$.name,
            assignment: value
        });
    });

    return constants;
};