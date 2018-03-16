const processDocumentation = require("./documentation").processDocumentation;

exports.processEnumerations = function(namespace) {
    if (!namespace.enumeration) return "";

    let enumerations = "";
    namespace.enumeration.forEach(function (enumeration) {
        enumerations += processDocumentation(enumeration);
        const fullyQualifiedEnumName = namespace.$.name + "." + enumeration.$.name;
        enumerations += fullyQualifiedEnumName + " = {";
        enumeration.member.forEach(function (enumMember) {
            enumerations += processDocumentation(enumMember);
            enumerations += enumMember.$.name.toUpperCase() + ":  " + Number(enumMember.$.value) + ",";
        });
        enumerations += "};";
    });
    return enumerations;
};