const _getParameterType = require('../conversions/glibBasicTypes').getParameterType;
const NamedElement = require('./NamedElement').NamedElement;

class NamedTypedElement extends NamedElement {
    /**
     * @param {*} data
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(data, namespace) {
        super(data, namespace);
        this._data = data;
        this._namespace = namespace;
    }

    /**
     * @return {string}
     */
    getType() {
        return _getParameterType(this.getData(), this.getNamespaceName());
    }
}

exports.NamedTypedElement = NamedTypedElement;