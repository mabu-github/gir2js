const GirFile = require('../gir/GirFile').GirFile;
const processNamespace = require('./namespace').processNamespace;

function processGir(gir) {
    let converted = "";
    let girFile = new GirFile(gir);
    girFile.getNamespaces().forEach(function (namespace) {
        converted += processNamespace(namespace);
    });
    return converted;
}

exports.processGir = processGir;