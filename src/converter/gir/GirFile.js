const Namespace = require('./Namespace').Namespace;

class GirFile {
    /**
     * @param {*} girFile
     * @constructor
     */
    constructor(girFile) {
        this._girFile = girFile;
    }

    /**
     * @return {Array.<Namespace>}
     */
    getNamespaces() {
        const namespaces = this._girFile.repository.namespace;
        return namespaces.map(namespace => new Namespace(namespace));
    }
}

exports.GirFile = GirFile;