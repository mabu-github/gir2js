const NamedElement = require("./NamedElement").NamedElement;

class Parameter extends NamedElement {
    /**
     * @param {*} parameter
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(parameter, namespace) {
        super(parameter, namespace);
    }
}

exports.Parameter = Parameter;