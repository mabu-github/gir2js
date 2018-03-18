const processDocumentation = require("./documentation").processDocumentation;

exports.processEnumerations = function(namespace) {
    if (!namespace.enumeration) return "";

    let enumerations = "";
    namespace.enumeration.forEach(function (enumeration) {
        enumerations += processDocumentation(enumeration, "\n\n@enum {number}");
        const fullyQualifiedEnumName = namespace.$.name + "." + enumeration.$.name;
        enumerations += fullyQualifiedEnumName + " = {";
        enumeration.member.forEach(function (enumMember) {
            enumerations += processDocumentation(enumMember);
            enumerations += enumMember.$.name.toUpperCase() + ":  " + enumMember.$.value + ",";
        });
        enumerations += "};";
    });
    return enumerations;
};