const processDocumentation = require("./documentation").processDocumentation;
const getDocblockSignatureForParameter = require("./documentation").getDocblockSignatureForParameter;
const transformJsKeywords = require("./jsKeywords").transformJsKeywords;
const getDocblockReturnValue = require("./documentation").getDocblockReturnValue;

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

exports.processFunctions = processFunctions;
exports.processFunctions2 = processFunctions2;