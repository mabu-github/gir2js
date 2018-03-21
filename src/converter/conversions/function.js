const getDocblockParameterTag = require("./documentation").getDocblockParameterTag;
const getDocblockReturnTag = require("./documentation").getDocblockReturnTag;
const Template = require("../templates/Template").Template;

/**
 * @param {string} namespace
 * @param {Array.<Function>} functions
 * @param {boolean} withoutClass
 * @param {boolean} callBackFunction
 * @return {string}
 */
function processFunctions(namespace, functions, withoutClass, callBackFunction=false) {
    let classMethods = "";
    functions.forEach(func => {
        let methodSignature = "";
        let methodParameters = [];

        func.getParameters().forEach((parameter, parameterIdx) => {
            methodSignature += getDocblockParameterTag(parameter);
            if (parameter.getName() !== "...") {
                methodParameters[parameterIdx] = {name: parameter.getName()};
            }
        });
        let returnType = func.getReturnType();
        if (returnType !== null) {
            methodSignature += getDocblockReturnTag(returnType);
        }
        let prefix = "";
        if (withoutClass) {
            prefix = namespace;
        } else {
            prefix = "this";
        }

        if (callBackFunction) {
            classMethods += Template.callback({
                documentation: func.getDocumentation().split("\n"),
                signature: methodSignature.split("\n"),
                prefix: prefix,
                method: func.getName(),
            });
        } else {
            classMethods += Template.method({
                documentation: func.getDocumentation().split("\n"),
                signature: methodSignature.split("\n"),
                prefix: prefix,
                method: func.getName(),
                parameters: methodParameters
            });
        }
    });

    return classMethods;
}

exports.processFunctions = processFunctions;