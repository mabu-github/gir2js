const
    getParameterType = require('./glibBasicTypes.js').getParameterType,
    transformJsKeywords = require('./jsKeywords.js').transformJsKeywords;

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

exports.getDocblockSignatureForParameter = function(docTag, parameter, alternativeParameterName=undefined) {
    let docblockSignature = "";
    docblockSignature += "\n" + docTag + " {";
    if (parameter.type) {
        docblockSignature += getParameterType(parameter);
    } else if (parameter.varargs) {
        docblockSignature += "...*";
    } else if (parameter.array) {
        docblockSignature += "Array.<" + getParameterType(parameter.array[0]) + ">";
    } else {
        throw new TypeError("Expected typed parameter or varargs");
    }
    docblockSignature += "}";
    if (!alternativeParameterName) {
        docblockSignature += " " + transformJsKeywords(parameter.$.name, "", "_");
    } else {
        docblockSignature += " " + alternativeParameterName;
    }
    return docblockSignature;
};