const getDocblockSignatureForParameter2 = require("./documentation").getDocblockSignatureForParameter2;
const transformJsKeywords = require("./jsKeywords").transformJsKeywords;
const getDocblockReturnValue = require("./documentation").getDocblockReturnValue;
const Template = require("../templates/Template").Template;

/**
 * @param {string} namespace
 * @param {Array.<Function>} functions
 * @param {boolean} withoutClass
 * @returns {string}
 */
function processFunctions(namespace, functions, withoutClass) {
    let classMethods = "";
    functions.forEach(function (func) {
        let method = func.getData();
        let methodSignature = "";
        let methodParameters = [];

        func.getParameters().forEach(function (parameter, parameterIdx) {
            methodSignature += getDocblockSignatureForParameter2("param", parameter, namespace);
            if (parameter.getName() !== "...") {
                methodParameters[parameterIdx] = {name: transformJsKeywords(parameter.getName(), "", "_")};
            }
        });
        methodSignature += getDocblockReturnValue(method, namespace);
        let prefix = "";
        if (withoutClass) {
            prefix = namespace;
        } else {
            prefix = "this";
        }

        classMethods += Template.method({
            documentation: func.getDocumentation().split("\n"),
            signature: methodSignature.split("\n"),
            prefix: prefix,
            method: func.getName(),
            parameters: methodParameters
        });
    });

    return classMethods;
}

exports.processFunctions = processFunctions;