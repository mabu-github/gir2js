exports.processDocumentation = function(type, appendAdditionalDocumentation = "") {
    let converted = "";
    if (type.doc) {
        converted += "/**\n" + type.doc[0]._ + appendAdditionalDocumentation + "\n*/";
    }
    return converted;
};