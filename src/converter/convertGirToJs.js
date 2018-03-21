#!/usr/bin/env node

const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const beautify = require('js-beautify').js_beautify;
const getTypesWithoutJsEquivalent = require('./gir/NamedTypedElement').getTypesWithoutJsEquivalent;
const processGir = require('./conversions/gir.js').processGir;
const execFile = require('child_process').execFile;

let outputDir = process.argv[2];
const girFiles = process.argv.slice(3);
if (!outputDir.startsWith("/")) {
    outputDir = path.normalize(__dirname + "/../../" + outputDir);
}

// write conversion
parser = new xml2js.Parser();
girFiles.forEach(function(girFile) {
    fs.readFile(girFile, function(err, data) {
        parser.parseString(data, function (err, result) {
            let converted = processGir(result);
            const jsFile = path.join(outputDir, path.basename(girFile).replace(/.gir/, ".js"));
            fs.writeFile(jsFile, beautify(converted, {indent_size: 4}), function(err) {
                if(err) {
                    console.log(err);
                }
            });
        });
    });
});

// write additional type file for types without javascript equivalent
let types = "var " + getTypesWithoutJsEquivalent().join(";\nvar ") + ";\n";
fs.writeFile(path.join(outputDir, "GLibJsIncompatibleTypes.js"), beautify(types, {indent_size: 4}), function(err) {
    if(err) {
        console.log(err);
    }
});

// put seed runtime file to output
execFile(path.join(__dirname, "runtime/describeSeed.js"), function(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    fs.writeFile(path.join(outputDir, "Seed.js"), beautify(data.toString(), {indent_size: 4}), function(err) {
        if(err) {
            console.log(err);
        }
    });
});

