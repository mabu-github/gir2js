const
    getParameterType = require('./glibBasicTypes.js').getParameterType,
    transformJsKeywords = require('./jsKeywords.js').transformJsKeywords,
    Template = require('../templates/Template').Template;

exports.processDocumentation = function(type, appendAdditionalDocumentation=undefined) {
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
};

exports.getDocblockSignatureForParameter = function(docTag, parameter, namespace) {
    return Template.typedDocTag({
        tag: docTag,
        type: getParameterType(parameter.getData(), namespace),
        parameter: transformJsKeywords(parameter.getName(), "", "_"),
        documentation: parameter.getDocumentation() + "\n"
    });
};

exports.getDocblockReturnTag = function(parameter, namespace) {
    return Template.typedDocTag({
        tag: "return",
        type: getParameterType(parameter.getData(), namespace),
        parameter: "",
        documentation: parameter.getDocumentation() + "\n"
    });
};

exports.getDocblockTypeTag = function(typedElement) {
    return Template.typedDocTag({
        tag: "type",
        type: typedElement.getType(),
        parameter: "",
        documentation: ""
    });
};

exports.getDocblockEnumTag = function() {
    return Template.typedDocTag({
        tag: "enum",
        type: "number",
        parameter: "",
        documentation: ""
    });
};