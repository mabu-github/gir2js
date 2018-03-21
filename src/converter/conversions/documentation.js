const Template = require('../templates/Template').Template;

function getDocblockSignatureForParameter(docTag, parameter) {
    return Template.typedDocTag({
        tag: docTag,
        type: parameter.getType(),
        parameter: parameter.getName(),
        documentation: parameter.getDocumentation() + "\n"
    });
}

function getDocblockReturnTag(parameter) {
    return Template.typedDocTag({
        tag: "return",
        type: parameter.getType(),
        parameter: "",
        documentation: parameter.getDocumentation() + "\n"
    });
}

function getDocblockTypeTag(typedElement) {
    return Template.typedDocTag({
        tag: "type",
        type: typedElement.getType(),
        parameter: "",
        documentation: ""
    });
}

function getDocblockEnumTag() {
    return Template.typedDocTag({
        tag: "enum",
        type: "number",
        parameter: "",
        documentation: ""
    });
}

exports.getDocblockSignatureForParameter = getDocblockSignatureForParameter;
exports.getDocblockReturnTag = getDocblockReturnTag;
exports.getDocblockTypeTag = getDocblockTypeTag;
exports.getDocblockEnumTag = getDocblockEnumTag;