const getDocblockTypeTag = require("./documentation").getDocblockTypeTag;
const processSignals = require("./signals").processSignals;
const processFunctions = require("./function").processFunctions;
const Template = require("../templates/Template").Template;

/**
 * @param {Array.<Class>} classes
 * @param {Namespace} namespace
 * @param {boolean} abstract
 * @return {string}
 */
function processClasses(classes, namespace, abstract) {
    let converted = "";
    classes.filter(clazz => clazz.isUsable()).forEach(clazz => {
        converted += processClass(namespace.getName(), clazz, abstract);
    });
    return converted;
}

/**
 * @param {string} namespace
 * @param {Class} clazz
 * @param {boolean} abstract
 * @return {string}
 */
function processClass(namespace, clazz, abstract) {
    let constructorParameters = clazz.getAllProperties().map(property => {
        return {
            name: property.getName(),
            type: property.getType()
        };
    });

    return Template.class({
        documentation: clazz.getDocumentation().split("\n"),
        constructorParameters: constructorParameters,
        extends: clazz.getFullyQualifiedParentName(),
        implements: clazz.getImplementedInterfaceNames(),
        abstract: abstract,
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
    clazz.getOwnProperties().forEach(property => {
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