const GirFile = require('../gir/GirFile').GirFile;
const processNamespace = require('./namespace').processNamespace;

/**
 * @param {*} gir
 * @return {string}
 */
function processGir(gir) {
    let converted = "";
    let girFile = new GirFile(gir);
    girFile.getNamespaces().forEach(namespace => {
        converted += processNamespace(namespace);
    });
    return converted;
}

exports.processGir = processGir;