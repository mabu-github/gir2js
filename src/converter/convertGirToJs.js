#!/usr/bin/env node

const
    xml2js = require('xml2js'),
    fs = require('fs'),
    path = require('path'),
    beautify = require('js-beautify').js_beautify,
    getTypesWithoutJsEquivalent = require('./conversions/glibBasicTypes.js').getTypesWithoutJsEquivalent,
    processEnumerations = require('./conversions/enumeration.js').processEnumerations,
    processClasses = require('./conversions/class.js').processClasses,
    processFunctions = require('./conversions/function.js').processFunctions,
    execFile = require('child_process').execFile,
    GirFile = require('./gir/GirFile').GirFile,
    Template = require('./templates/Template').Template,
    getDocblockSignatureForParameter2 = require("./conversions/documentation").getDocblockSignatureForParameter2;

const girFile = process.argv[2];
let jsFile = process.argv[3];
if (!jsFile.startsWith("/")) {
    jsFile = path.normalize(__dirname + "/../../" + jsFile);
}

console.log(girFile);
console.log(jsFile);

function processGir(gir) {
    let converted = "";
    let girFile = new GirFile(gir);
    girFile.getNamespaces().forEach(function (namespace) {
        const name = namespace.getName();
        const data = namespace.getData();

        // namespace
        converted += Template.renderFile(Template.TPL_NAMESPACE, {namespace: name});

        // constants
        namespace.getConstants().forEach(function (constant) {
            converted += Template.renderFile(Template.TPL_VARIABLE_ASSIGNMENT, {
                documentation: constant.getDocumentation().split("\n"),
                signature: getDocblockSignatureForParameter2("@type", constant, name).split("\n"),
                prefix: name,
                variable: constant.getName(),
                assignment: constant.getValue()
            });
        });

        converted += processEnumerations(data.enumeration, name);
        converted += processEnumerations(data.bitfield, name);
        converted += processFunctions(name, data.function, true);
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

