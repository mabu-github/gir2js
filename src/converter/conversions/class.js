exports.processClasses = processClasses;

const processDocumentation = require("./documentation").processDocumentation;
const getDocblockSignatureForParameter = require("./documentation").getDocblockSignatureForParameter;
const getDocblockSignatureForParameter2 = require("./documentation").getDocblockSignatureForParameter2;
const processSignals = require("./signals").processSignals;
const processFunctions = require("./function").processFunctions;
const getParameterType = require("./glibBasicTypes").getParameterType;
const Template = require("../templates/Template").Template;

/**
 * @param {Namespace} namespace
 * @returns {string}
 */
function processClasses(namespace) {
    let converted = "";
    namespace.getClasses().forEach(function (clazz) {
        converted += processClass(namespace.getName(), clazz);
    });
    return converted;
}

/**
 * @param {string} namespace
 * @param {Class} clazz
 * @returns {string}
 */
function processClass(namespace, clazz) {
    let numConstructorParameters = 0;
    let constructorSignatures = "";
    let constructorRecords = "";
    const name = clazz.getName();
    const data = clazz.getData();

    if (clazz.getConstructors().length > 1) {
        console.log("multiple constructors");
    }

    clazz.getConstructors().forEach(function (constructorClass) {
        const constructor = constructorClass.getData();

        constructorSignatures += "\n\n@signature";
        if (constructor.parameters) {
            numConstructorParameters = Math.max(numConstructorParameters, constructor.parameters[0].parameter.length);

            if (constructor.parameters[0].parameter.length > 0) {
                let constructorRecordParams = [];
                constructorRecords += "\n\n@signature";
                constructorRecords += "\n@param {{";
                constructor.parameters[0].parameter.forEach(function (parameter, parameterIdx) {
                    const alternativeParameterName = "arg" + parameterIdx + " " + parameter.$.name;
                    constructorSignatures += getDocblockSignatureForParameter("@param", parameter, namespace, alternativeParameterName);
                    constructorRecordParams[parameterIdx] = parameter.$.name + ": " + getParameterType(parameter, namespace);
                });
                constructorRecords += constructorRecordParams.join(", ");
                constructorRecords += "}} arg0";
            }
        }
        constructorSignatures += "\n@return {" + namespace + "." + name + "}";
    });

    let constructorParameters = [];
    for (let i = 0; i < numConstructorParameters; i++) {
        constructorParameters[i] = "arg" + i;
    }

    let converted = "\n";

    let augmentsTag = "";
    if (clazz.getParent() !== null) {
        augmentsTag = "\n@augments " + clazz.getParent().getFullyQualifiedName();
    }
    constructorRecords = "\n\n@signature\n@param {{";
    constructorRecords += clazz.getAllProperties().map(function(property) {
        return "[" + property.getName() + "]" + ": " + property.getType();
    }).join(",\n");
    constructorRecords += "}} constructorProperties\n";
    converted += processDocumentation(data, augmentsTag + constructorRecords);
    const fullyQualifiedName = namespace + "." + name;
    converted += fullyQualifiedName + " = ";
    converted += "function (constructorProperties)" + "{"
        + "/** " + constructorSignatures + augmentsTag + "\n*/" + "this.c_new = function (" + constructorParameters.join(", ") + ") {};\n"
        + processSignals(data)
        + processClassProperties(namespace, clazz)
        + processFunctions(namespace, clazz.getAllFunctions(), false)
        + "}";
    converted += ";\n";

    return converted;
}

/**
 * @param {string} namespace
 * @param {Class} clazz
 * @returns {string}
 */
function processClassProperties(namespace, clazz) {
    let properties = "";
    clazz.getOwnProperties().forEach(function (property) {
        properties += Template.variableAssignment({
            documentation: property.getDocumentation().split("\n"),
            signature: getDocblockSignatureForParameter2("type", property, namespace).split("\n"),
            prefix: "this",
            variable: property.getName(),
            assignment: "null"
        });
    });
    return properties;
}