const processDocumentation = require("./documentation").processDocumentation;

function processEnumerations(enums, namespace) {
    if (!enums) return "";

    let enumerations = "";
    enums.forEach(function (enumeration) {
        enumerations += processDocumentation(enumeration, "\n\n@enum {number}");
        const fullyQualifiedEnumName = namespace + "." + enumeration.$.name;
        enumerations += fullyQualifiedEnumName + " = {";
        enumeration.member.forEach(function (enumMember) {
            enumerations += processDocumentation(enumMember);
            enumerations += enumMember.$.name.toUpperCase() + ":  " + enumMember.$.value + ",";
        });
        enumerations += "};";
    });
    return enumerations;
}

exports.processEnumerations = processEnumerations;