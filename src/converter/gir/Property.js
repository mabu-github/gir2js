const _getParameterType = require('../conversions/glibBasicTypes').getParameterType;
const _getValidJsPropertyName = require('../conversions/property').getValidJsPropertyName;
const NamedElement = require('./NamedElement').NamedElement;

class Property extends NamedElement {
    /**
     * @param {*} property
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(property, namespace) {
        super(property, namespace);
        this._property = property;
        this._namespace = namespace;
    }

    /**
     * @return {string}
     */
    getType() {
        return _getParameterType(this._property, this._namespace.getName());
    }
}

exports.Property = Property;