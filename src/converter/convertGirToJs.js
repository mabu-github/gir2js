#!/usr/bin/env node

const
    xml2js = require('xml2js'),
    fs = require('fs'),
    path = require('path'),
    beautify = require('js-beautify').js_beautify,
    getTypesWithoutJsEquivalent = require('./conversions/glibBasicTypes.js').getTypesWithoutJsEquivalent,
    processDocumentation = require('./conversions/documentation.js').processDocumentation,
    getDocblockSignatureForParameter = require('./conversions/documentation.js').getDocblockSignatureForParameter,
    transformJsKeywords = require('./conversions/jsKeywords.js').transformJsKeywords,
    processEnumerations = require('./conversions/enumeration.js').processEnumerations,
    processConstants = require('./conversions/constant.js').processConstants,
    processSignals = require('./conversions/signals').processSignals;

const girFile = process.argv[2];
let jsFile = process.argv[3];
if (!jsFile.startsWith("/")) {
    jsFile = path.normalize(__dirname + "/../../" + jsFile);
}

console.log(girFile);
console.log(jsFile);

function processGir(gir) {
    let converted = "";
    const repository = gir['repository'];
    repository['namespace'].forEach(function (namespace) {
        const name = namespace.$.name;
        converted += "var " + name + " = {};\n";
        converted += processConstants(namespace);
        converted += processEnumerations(namespace);
        converted += processClasses(namespace);
    });
    return converted;
}

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
                    constructorSignatures += getDocblockSignatureForParameter("@param", parameter, alternativeParameterName);
                });
            }
            constructorSignatures += "\n@return {" + name + "}";
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
        + processClassProperties(clazz)
        + processClassMethods(clazz)
        + "}";
    converted += ";\n";

    return converted;
}

function processClassProperties(clazz) {
    if (!clazz.property) return "";

    let properties = "";
    clazz.property.forEach(function (property) {
        let propertySignature = "\n" + getDocblockSignatureForParameter("@type", property);
        properties += processDocumentation(property, propertySignature);
        properties += "this['" + property.$.name + "'] = null;\n";
    });
    return properties;
}

function processClassMethods(clazz) {
    if (!clazz.method) return "";

    let classMethods = "";
    clazz.method.forEach(function (method) {
        let methodSignature = "";
        let methodParameters = [];
        if (method.parameters && method.parameters[0].parameter) {
            method.parameters[0].parameter.forEach(function (parameter, parameterIdx) {
                methodSignature += getDocblockSignatureForParameter("@param", parameter);
                if (parameter.$.name !== "...") {
                    methodParameters[parameterIdx] = transformJsKeywords(parameter.$.name, "", "_");
                }
            });
        }
        classMethods += processDocumentation(method, methodSignature);
        classMethods += "this." + method.$.name + " = function(" + methodParameters.join(", ") + ") {};\n";
    });

    return classMethods;
}

// write conversion
parser = new xml2js.Parser();
fs.readFile(girFile, function(err, data) {
    parser.parseString(data, function (err, result) {
        let converted = processGir(result);
        fs.writeFile(jsFile, beautify(converted, {indent_size: 4}), function(err) {
            if(err) {
                console.log(err);
            }
        });
    });
});

// write additional type file for types without javascript equivalent
let types = "var " + getTypesWithoutJsEquivalent().join(";\nvar ") + ";\n";
fs.writeFile(path.dirname(jsFile) + "/GLibJsIncompatibleTypes.js", beautify(types, {indent_size: 4}), function(err) {
    if(err) {
        console.log(err);
    }
});