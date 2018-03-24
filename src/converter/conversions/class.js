const getDocblockTypeTag = require("./documentation").getDocblockTypeTag;
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

    return preprocessSignals(clazz) + Template.class({
        documentation: clazz.getDocumentation().split("\n"),
        constructorParameters: constructorParameters,
        extends: clazz.getFullyQualifiedParentName(),
        implements: clazz.getImplementedInterfaceNames(),
        abstract: abstract,
        prefix: clazz.getNamespaceName(),
        class: clazz.getName(),
        classBody: processSignals(clazz)
            + processClassFields(namespace, clazz)
            + processClassProperties(namespace, clazz)
            + processFunctions(namespace, clazz.getAllFunctions(), false, false)
    });
}

/**
 * @param {string} namespace
 * @param {Class} clazz
 * @return {string}
 */
function processClassFields(namespace, clazz) {
    let fields = "";
    clazz.getFields().filter(field => field.isUsable()).forEach(field => {
        fields += processFunctions(namespace, field.getCallbackFunctions(), true, true, function(field) {
            return getCallbackTypenameForField(clazz.getData(), field);
        });
        const signature = field.hasCallbackFunctions()
            ? "@type " + getCallbackTypenameForField(clazz.getData(), field)
            : getDocblockTypeTag(field).split("\n");

        fields += Template.variableAssignment({
            documentation: field.getDocumentation().split("\n"),
            signature: signature,
            prefix: "this",
            variable: field.getName(),
            assignment: "null"
        });
    });
    return fields;
}

/**
 * @param {*} parameter
 * @param {NamedElement} namedElement
 * @returns {string}
 */
function getCallbackTypenameForField(parameter, namedElement) {
    return "callback_" + namedElement.getNamespaceName() + "_" + parameter.$.name + "_" + namedElement.getName();
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

/**
 * @param {Class} clazz
 * @return {string}
 */
function processSignals(clazz) {
    return Template.variableAssignment({
        documentation: null,
        signature: ["@type {" + getSignalTypename(clazz) + "}"],
        prefix: "this",
        variable: "signal",
        assignment: "null"
    });
}

/**
 * @param {Class} clazz
 * @return {string}
 */
function preprocessSignals(clazz) {
    const classSignals = clazz.getOwnSignals();
    if (classSignals.length === 0)
        return "";

    let signals = "";

    classSignals.forEach(signal => {
        signals += Template.variableAssignment({
            documentation: signal.getDocumentation().split("\n"),
            prefix: "this",
            variable: signal.getName(),
            assignment: Template.signalType()
        });
    });

    signals =  Template.class({
        documentation: [],
        variableSpecifier: "const",
        class: getSignalTypename(clazz),
        classBody: signals
    });

    return signals;
}

function getSignalTypename(clazz) {
    return "__signals_" + clazz.getName();
}

exports.processClasses = processClasses;