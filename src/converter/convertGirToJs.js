#!/usr/bin/env node

const
    xml2js = require('xml2js'),
    fs = require('fs'),
    path = require('path'),
    beautify = require('js-beautify').js_beautify,
    getParameterType = require('./conversions/glibBasicTypes.js').getParameterType,
    processDocumentation = require('./conversions/documentation.js').processDocumentation,
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
        converted += processClasses(namespace)
    });
    return converted;
}

function processClasses(namespace) {
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
            constructorSignatures += "\n";
            if (constructor.parameters) {
                numConstructorParameters = Math.max(numConstructorParameters, constructor.parameters[0].parameter.length);

                constructorSignatures += "\n@signature";
                constructor.parameters[0].parameter.forEach(function (parameter, parameterIdx) {
                    constructorSignatures += "\n@param {";
                    if (parameter.type) {
                        constructorSignatures += getParameterType(parameter);
                    } else if (parameter.varargs) {
                        constructorSignatures += "...*";
                    } else if (parameter.array) {
                        constructorSignatures += "Array.<" + getParameterType(parameter.array[0]) + ">";
                    } else {
                        throw new TypeError("Expected typed parameter or varargs");
                    }
                    constructorSignatures += "} " + "arg" + parameterIdx;
                    if (parameter.$.name) {
                        constructorSignatures += " " + parameter.$.name;
                    }
                });
                constructorSignatures += "\n@return {" + name + "}";
            } else {
                constructorSignatures += "\n@signature\n@return {" + name + "}";
            }
        });
    }

    let constructorParameters = [];
    for (let i = 0; i < numConstructorParameters; i++) {
        constructorParameters[i] = "arg" + i;
    }

    let signals = processSignals(clazz);

    let converted = "\n";
    converted += processDocumentation(clazz, constructorSignatures);
    converted += namespace + "." + name + " = ";
    converted += "function (" + constructorParameters.join(", ") + ")" + "{"
        + "/** " + constructorSignatures + "\n*/" + "this.c_new = function (" + constructorParameters.join(", ") + ") {};\n"
        + signals
        + "}";
    converted += ";\n";

    return converted;
}

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