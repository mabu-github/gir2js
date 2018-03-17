exports.processFunctions = processFunctions;

const processDocumentation = require("./documentation").processDocumentation;
const getDocblockSignatureForParameter = require("./documentation").getDocblockSignatureForParameter;
const transformJsKeywords = require("./jsKeywords").transformJsKeywords;
const getDocblockReturnValue = require("./documentation").getDocblockReturnValue;

function processFunctions(namespace, functions) {
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
        classMethods += "this." + method.$.name + " = function(" + methodParameters.join(", ") + ") {};\n";
    });

    return classMethods;
}