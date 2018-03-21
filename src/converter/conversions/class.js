const getDocblockTypeTag = require("./documentation").getDocblockTypeTag;
const processSignals = require("./signals").processSignals;
const processFunctions = require("./function").processFunctions;
const Template = require("../templates/Template").Template;

/**
 * @param {Namespace} namespace
 * @return {string}
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
 * @return {string}
 */
function processClass(namespace, clazz) {
    let constructorParameters = clazz.getAllProperties().map(function(property) {
        return {
            name: property.getName(),
            type: property.getType()
        };
    });

    return Template.class({
        documentation: clazz.getDocumentation().split("\n"),
        constructorParameters: constructorParameters,
        extends: clazz.getParent().getFullyQualifiedName(),
        implements: clazz.getImplementedInterfaces().map(interface_ => interface_.getName()),
        prefix: clazz.getNamespaceName(),
        class: clazz.getName(),
        classBody: processSignals(clazz)
            + processClassProperties(namespace, clazz)
            + processFunctions(namespace, clazz.getAllFunctions(), false, false)
    });
}

/**
 * @param {string} namespace
 * @param {Class} clazz
 * @return {string}
 */
function processClassProperties(namespace, clazz) {
    let properties = "";
    clazz.getOwnProperties().forEach(function (property) {
        properties += Template.variableAssignment({
            documentation: property.getDocumentation().split("\n"),
            signature: getDocblockTypeTag(property).split("\n"),
            prefix: "this",
            variable: property.getName(),
            assignment: "null"
        });
    });
    return properties;
}

exports.processClasses = processClasses;