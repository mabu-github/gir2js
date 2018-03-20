exports.processClasses = processClasses;

const processDocumentation = require("./documentation").processDocumentation;
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
    const name = clazz.getName();
    const data = clazz.getData();

    clazz.getConstructors().forEach(function (constructorClass) {
        const constructor = constructorClass.getData();

        if (constructor.parameters) {
            if (constructor.parameters[0].parameter.length > 0) {
                let constructorRecordParams = [];
                constructor.parameters[0].parameter.forEach(function (parameter, parameterIdx) {
                    constructorRecordParams[parameterIdx] = parameter.$.name + ": " + getParameterType(parameter, namespace);
                });
            }
        }
    });

    let converted = "\n";

    let augmentsTag = "";
    if (clazz.getParent() !== null) {
        augmentsTag = "\n@augments " + clazz.getParent().getFullyQualifiedName();
    }
    let constructorRecords = "\n\n@param {{";
    constructorRecords += clazz.getAllProperties().map(function(property) {
        return "[" + property.getName() + "]" + ": " + property.getType();
    }).join(",\n");
    constructorRecords += "}} constructorProperties\n";
    converted += processDocumentation(data, augmentsTag + constructorRecords);
    const fullyQualifiedName = namespace + "." + name;
    converted += fullyQualifiedName + " = ";
    converted += "function (constructorProperties)" + "{"
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