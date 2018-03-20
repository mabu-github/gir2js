#!/usr/bin/env node

const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const beautify = require('js-beautify').js_beautify;
const getTypesWithoutJsEquivalent = require('./conversions/glibBasicTypes.js').getTypesWithoutJsEquivalent;
const processClasses = require('./conversions/class.js').processClasses;
const processFunctions = require('./conversions/function.js').processFunctions;
const execFile = require('child_process').execFile;
const GirFile = require('./gir/GirFile').GirFile;
const Template = require('./templates/Template').Template;
const getUnnamedDocblockParameter = require("./conversions/documentation").getUnnamedDocblockParameter;

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
        converted += Template.namespace(name);

        // constants
        namespace.getConstants().forEach(function (constant) {
            converted += Template.renderFile(Template.TPL_VARIABLE_ASSIGNMENT, {
                documentation: constant.getDocumentation().split("\n"),
                signature: getUnnamedDocblockParameter("type", constant.getType(), constant.getName()).split("\n"),
                prefix: name,
                variable: constant.getName(),
                assignment: constant.getValue()
            });
        });

        // enumerations, bitfields
        const enumerationsAndBitfields = namespace.getEnumerations().concat(namespace.getBitfields());
        enumerationsAndBitfields.forEach(function (enumeration) {
            let enumMembers = enumeration.getMembers().map(function (enumMember) {
                return {
                    name: enumMember.getName(),
                    definition: enumMember.getValue(),
                    documentation: enumMember.getDocumentation().split("\n")
                };
            });

            converted += Template.renderFile(Template.TPL_VARIABLE_ASSIGNMENT, {
                documentation: enumeration.getDocumentation().split("\n"),
                signature: getUnnamedDocblockParameter("enum", "number", enumeration.getName()).split("\n"),
                prefix: name,
                variable: enumeration.getName(),
                assignment: Template.literalObject(enumMembers)
            });
        });

        converted += processFunctions(name, namespace.getFunctions(), true);

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

