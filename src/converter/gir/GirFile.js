const Namespace = require('./Namespace').Namespace;

/**
 * @param {*} girFile
 * @constructor
 */
const GirFile = function(girFile) {
    const repository = girFile.repository;
    const namespaces = repository.namespace;

    /**
     * @return {Array.<Namespace>}
     */
    this.getNamespaces = function () {
        return namespaces.map(function(namespace) {
            return new Namespace(namespace);
        });
    };
};

exports.GirFile = GirFile;