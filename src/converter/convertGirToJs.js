#!/usr/bin/env node

const
    xml2js = require('xml2js'),
    fs = require('fs'),
    path = require('path');

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
    });
    return converted;
}

parser = new xml2js.Parser();
fs.readFile(girFile, function(err, data) {
    parser.parseString(data, function (err, result) {
        let converted = processGir(result);
        fs.writeFile(jsFile, converted, function(err) {
            if(err) {
                console.log(err);
            }
        });
    });
});