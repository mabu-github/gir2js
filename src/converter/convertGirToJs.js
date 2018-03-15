#!/usr/bin/env node

const
    xml2js = require('xml2js'),
    fs = require('fs'),
    path = require('path'),
    beautify = require('js-beautify').js_beautify;

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
        converted += "var " + name + " = {"
            + processClasses(namespace)
            + "};\n";
    });
    return converted;
}

function processClasses(namespace) {
    let converted = "";
    namespace.class.forEach(function (clazz) {
        converted += processClass(clazz);
    });
    return converted;
}

function processClass(clazz) {
    let numConstructorParameters = 0;
    // first constructor belongs to JavaScript internals,
    // starting from second belongs to class definition
    if (clazz.constructor.length !== 1) {
        clazz.constructor.forEach(function (constructor, idx) {
            if (idx === 0) return;
            if (constructor.parameters) {
                numConstructorParameters = Math.max(numConstructorParameters, constructor.parameters[0].parameter.length);
            }
        });
    }

    let constructorParameters = [];
    for (let i = 0; i < numConstructorParameters; i++) {
        constructorParameters[i] = "arg" + i;
    }

    let converted = "";
    converted += processDocumentation(clazz, converted);
    converted += clazz.$.name + ": ";
    converted += "function (" + constructorParameters.join(", ") + ")" + "{" + "}";
    converted += ",";

    return converted;
}

function processDocumentation(type) {
    let converted = "";
    if (type.doc) {
        converted += "/**" + type.doc[0]._ + "*/";
    }
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