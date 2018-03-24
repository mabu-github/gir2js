#!/usr/bin/env node

const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const beautify = require('js-beautify').js_beautify;
const getTypesWithoutJsEquivalent = require('./gir/NamedTypedElement').getTypesWithoutJsEquivalent;
const processGir = require('./conversions/gir.js').processGir;
const execFile = require('child_process').execFile;
const Template = require('./templates/Template').Template;

let outputDir = process.argv[2];
const girFiles = process.argv.slice(3);
if (!outputDir.startsWith("/")) {
    outputDir = path.normalize(__dirname + "/../../" + outputDir);
}

// write conversion
parser = new xml2js.Parser();
girFiles.forEach(girFile => {
    fs.readFile(girFile, (err, data) => {
        parser.parseString(data, (err, result) => {
            let converted = processGir(result);
            const jsFile = path.join(outputDir, path.basename(girFile).replace(/.gir/, ".js"));
            fs.writeFile(jsFile, beautify(converted, {indent_size: 4}), err => {
                if(err) {
                    console.log(err);
                }
            });
        });
    });
});

// write signal type file
fs.writeFile(path.join(outputDir, "SignalType.js"), beautify(Template.signalType(), {indent_size: 4}), err => {
    if(err) {
        console.log(err);
    }
});

// write additional type file for types without javascript equivalent
let types = "var " + getTypesWithoutJsEquivalent().join(";\nvar ") + ";\n";
fs.writeFile(path.join(outputDir, "GLibJsIncompatibleTypes.js"), beautify(types, {indent_size: 4}), err => {
    if(err) {
        console.log(err);
    }
});

// put seed runtime file to output
execFile(path.join(__dirname, "runtime/describeSeed.js"), (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    fs.writeFile(path.join(outputDir, "Seed.js"), beautify(data.toString(), {indent_size: 4}), err => {
        if(err) {
            console.log(err);
        }
    });
});

