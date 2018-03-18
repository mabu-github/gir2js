#!/usr/bin/env node

const
    xml2js = require('xml2js'),
    fs = require('fs'),
    path = require('path'),
    beautify = require('js-beautify').js_beautify,
    getTypesWithoutJsEquivalent = require('./conversions/glibBasicTypes.js').getTypesWithoutJsEquivalent,
    processEnumerations = require('./conversions/enumeration.js').processEnumerations,
    processConstants = require('./conversions/constant.js').processConstants,
    processClasses = require('./conversions/class.js').processClasses,
    processFunctions = require('./conversions/function.js').processFunctions
    execFile = require('child_process').execFile;

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
        converted += processFunctions(name, namespace.function, true);
        converted += processClasses(namespace);
    });
    return converted;
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

// put seed runtime file to output
execFile(__dirname + "/runtime/describeSeed.js", function(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    fs.writeFile(path.dirname(jsFile) + "/Seed.js", beautify(data.toString(), {indent_size: 4}), function(err) {
        if(err) {
            console.log(err);
        }
    });
});

