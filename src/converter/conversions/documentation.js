const Template = require('../templates/Template').Template;

/**
 * @param {Parameter} parameter
 * @return {string}
 */
function getDocblockParameterTag(parameter) {
    return Template.typedDocTag({
        tag: "param",
        type: parameter.getType(),
        parameter: parameter.getName(),
        documentation: parameter.getDocumentation() + "\n"
    });
}

/**
 * @param {ReturnType} parameter
 * @return {string}
 */
function getDocblockReturnTag(parameter) {
    return Template.typedDocTag({
        tag: "return",
        type: parameter.getType(),
        parameter: "",
        documentation: parameter.getDocumentation() + "\n"
    });
}

/**
 * @param {NamedTypedElement} typedElement
 * @return {string}
 */
function getDocblockTypeTag(typedElement) {
    return Template.typedDocTag({
        tag: "type",
        type: typedElement.getType(),
        parameter: "",
        documentation: ""
    });
}

/**
 * @return {string}
 */
function getDocblockEnumTag() {
    return Template.typedDocTag({
        tag: "enum",
        type: "number",
        parameter: "",
        documentation: ""
    });
}

exports.getDocblockParameterTag = getDocblockParameterTag;
exports.getDocblockReturnTag = getDocblockReturnTag;
exports.getDocblockTypeTag = getDocblockTypeTag;
exports.getDocblockEnumTag = getDocblockEnumTag;