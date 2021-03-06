const processClasses = require('./class.js').processClasses;
const processFunctions = require('./function.js').processFunctions;
const getDocblockTypeTag = require("./documentation").getDocblockTypeTag;
const getDocblockEnumTag = require("./documentation").getDocblockEnumTag;
const Template = require('../templates/Template').Template;

/**
 * @param {Namespace} namespace
 * @return {string}
 */
function processNamespace(namespace) {
    let converted = "";

    // namespace
    converted += Template.namespace(namespace.getName());

    // constants
    namespace.getConstants().forEach(constant => {
        converted += Template.variableAssignment({
            documentation: constant.getDocumentation().split("\n"),
            signature: getDocblockTypeTag(constant),
            prefix: namespace.getName(),
            variable: constant.getName(),
            assignment: constant.getValue()
        });
    });

    // enumerations, bitfields
    const enumerationsAndBitfields = namespace.getEnumerations().concat(namespace.getBitfields());
    enumerationsAndBitfields.forEach(enumeration => {
        let enumMembers = enumeration.getMembers().map(enumMember => {
            return {
                name: enumMember.getName(),
                definition: enumMember.getValue(),
                documentation: enumMember.getDocumentation().split("\n")
            };
        });

        converted += Template.variableAssignment({
            documentation: enumeration.getDocumentation().split("\n"),
            signature: getDocblockEnumTag(),
            prefix: namespace.getName(),
            variable: enumeration.getName(),
            assignment: Template.literalObject(enumMembers)
        });
    });

    converted += processFunctions(namespace.getName(), namespace.getCallbackFunctions(), true, true, function(element) {
        return element.getNamespaceName() + "_" + element.getName();
    });
    converted += processFunctions(namespace.getName(), namespace.getFunctions(), true, false);

    converted += processClasses(namespace.getInterfaces(), namespace, true);
    converted += processClasses(namespace.getClasses(), namespace, false);
    converted += processClasses(namespace.getRecords(), namespace, false);

    return converted;
}

exports.processNamespace = processNamespace;