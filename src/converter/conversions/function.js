const processDocumentation = require("./documentation").processDocumentation;
const getDocblockSignatureForParameter = require("./documentation").getDocblockSignatureForParameter;
const getDocblockSignatureForParameter2 = require("./documentation").getDocblockSignatureForParameter2;
const transformJsKeywords = require("./jsKeywords").transformJsKeywords;
const getDocblockReturnValue = require("./documentation").getDocblockReturnValue;
const Template = require("../templates/Template").Template;

function processFunctions(namespace, functions, withoutClass) {
    if (!functions) return "";

    let classMethods = "";
    functions.forEach(function (method) {
        let methodSignature = "";
        let methodParameters = [];
        if (method.parameters && method.parameters[0].parameter) {
            method.parameters[0].parameter.forEach(function (parameter, parameterIdx) {
                methodSignature += getDocblockSignatureForParameter("@param", parameter, namespace);
                if (parameter.$.name !== "...") {
                    methodParameters[parameterIdx] = transformJsKeywords(parameter.$.name, "", "_");
                }
            });
        }
        methodSignature += getDocblockReturnValue(method, namespace);
        classMethods += processDocumentation(method, methodSignature);
        if (withoutClass) {
            classMethods += namespace;
        } else {
            classMethods += "this";
        }
        classMethods += "." + method.$.name + " = function(" + methodParameters.join(", ") + ") {};\n";
    });

    return classMethods;
}

/**
 * @param {string} namespace
 * @param {Array.<Function>} functions
 * @param {boolean} withoutClass
 * @returns {string}
 */
function processFunctions2(namespace, functions, withoutClass) {
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
exports.processFunctions2 = processFunctions2;