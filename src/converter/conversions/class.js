exports.processClasses = processClasses;

const processDocumentation = require("./documentation").processDocumentation;
const getDocblockSignatureForParameter = require("./documentation").getDocblockSignatureForParameter;
const processSignals = require("./signals").processSignals;
const processFunctions2 = require("./function").processFunctions2;
const getParameterType = require("./glibBasicTypes").getParameterType;
const getValidJsPropertyName = require("./property").getValidJsPropertyName;

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

    // first constructor belongs to JavaScript internals,
    // starting from second belongs to class definition
    if (data.constructor.length !== 1) {
        data.constructor.forEach(function (constructor, constructorIdx) {
            if (constructorIdx === 0) return;
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
    }

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
        + processClassProperties(namespace, data)
        + processFunctions2(namespace, clazz.getFunctions(), false)
        + "}";
    converted += ";\n";

    return converted;
}

function processClassProperties(namespace, clazz) {
    if (!clazz.property) return "";

    let properties = "";
    clazz.property.forEach(function (property) {
        let propertySignature = "\n" + getDocblockSignatureForParameter("@type", property, namespace);
        properties += processDocumentation(property, propertySignature);
        properties += "this." + getValidJsPropertyName(property.$.name) + " = null;\n";
    });
    return properties;
}