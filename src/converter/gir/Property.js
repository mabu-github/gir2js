const NamedTypedElement = require('./NamedTypedElement').NamedTypedElement;

class Property extends NamedTypedElement {
    /**
     * @param {*} property
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(property, namespace) {
        super(property, namespace);
    }
}

exports.Property = Property;