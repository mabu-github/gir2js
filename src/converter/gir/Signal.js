const NamedElement = require('./NamedElement').NamedElement;

class Signal extends NamedElement {
    /**
     * @param {*} signal
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(signal, namespace) {
        super(signal, namespace);
    }
}

exports.Signal = Signal;