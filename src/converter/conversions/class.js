exports.processClasses = processClasses;

const processDocumentation = require("./documentation").processDocumentation;
const getDocblockSignatureForParameter = require("./documentation").getDocblockSignatureForParameter;
const processSignals = require("./signals").processSignals;
const processFunctions = require("./function").processFunctions;

function processClasses(namespace) {
    if (!namespace.class) return "";

    let converted = "";
    namespace.class.forEach(function (clazz) {
        converted += processClass(namespace.$.name, clazz);
    });
    return converted;
}

function processClass(namespace, clazz) {
    let numConstructorParameters = 0;
    let constructorSignatures = "";
    const name = clazz.$.name;

    // first constructor belongs to JavaScript internals,
    // starting from second belongs to class definition
    if (clazz.constructor.length !== 1) {
        clazz.constructor.forEach(function (constructor, constructorIdx) {
            if (constructorIdx === 0) return;
            constructorSignatures += "\n\n@signature";
            if (constructor.parameters) {
                numConstructorParameters = Math.max(numConstructorParameters, constructor.parameters[0].parameter.length);

                constructor.parameters[0].parameter.forEach(function (parameter, parameterIdx) {
                    const alternativeParameterName = "arg" + parameterIdx + " " + parameter.$.name;
                    constructorSignatures += getDocblockSignatureForParameter("@param", parameter, namespace, alternativeParameterName);
                });
            }
            constructorSignatures += "\n@return {" + namespace + "." + name + "}";
        });
    }

    let constructorParameters = [];
    for (let i = 0; i < numConstructorParameters; i++) {
        constructorParameters[i] = "arg" + i;
    }

    let converted = "\n";
    converted += processDocumentation(clazz, constructorSignatures);
    converted += namespace + "." + name + " = ";
    converted += "function (" + constructorParameters.join(", ") + ")" + "{"
        + "/** " + constructorSignatures + "\n*/" + "this.c_new = function (" + constructorParameters.join(", ") + ") {};\n"
        + processSignals(clazz)
        + processClassProperties(namespace, clazz)
        + processClassMethods(namespace, clazz)
        + processClassFunctions(namespace, clazz)
        + "}";
    converted += ";\n";

    return converted;
}

function processClassProperties(namespace, clazz) {
    if (!clazz.property) return "";

    let properties = "";
    clazz.property.forEach(function (property) {
        let propertySignature = "\n" + getDocblockSignatureForParameter("@type", property, namespace);
        properties += processDocumentation(property, propertySignature);
        properties += "this['" + property.$.name + "'] = null;\n";
    });
    return properties;
}

function processClassMethods(namespace, clazz) {
    if (!clazz.method) return "";

    return processFunctions(namespace, clazz.method, false);
}

function processClassFunctions(namespace, clazz) {
    if (!clazz.function) return "";

    return processFunctions(namespace, clazz.function, false);
}