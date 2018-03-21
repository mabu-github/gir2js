const getParameterType = require('./glibBasicTypes.js').getParameterType;
const transformJsKeywords = require('./jsKeywords.js').transformJsKeywords;
const Template = require('../templates/Template').Template;

function processDocumentation(type, appendAdditionalDocumentation=undefined) {
    if (!type.doc && !appendAdditionalDocumentation) return "";

    let converted = "";
    converted += "/**\n";
    if (type.doc) {
        converted += type.doc[0]._;
    }
    if (appendAdditionalDocumentation) {
        converted += appendAdditionalDocumentation;
    }
    converted += "\n*/";

    return converted;
}

function getDocblockSignatureForParameter(docTag, parameter, namespace) {
    return Template.typedDocTag({
        tag: docTag,
        type: getParameterType(parameter.getData(), namespace),
        parameter: transformJsKeywords(parameter.getName(), "", "_"),
        documentation: parameter.getDocumentation() + "\n"
    });
}

function getDocblockReturnTag(parameter, namespace) {
    return Template.typedDocTag({
        tag: "return",
        type: getParameterType(parameter.getData(), namespace),
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

exports.processDocumentation = processDocumentation;
exports.getDocblockSignatureForParameter = getDocblockSignatureForParameter;
exports.getDocblockReturnTag = getDocblockReturnTag;
exports.getDocblockTypeTag = getDocblockTypeTag;
exports.getDocblockEnumTag = getDocblockEnumTag;