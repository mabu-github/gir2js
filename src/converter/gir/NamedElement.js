const _getValidJsIdentifierName = require('../conversions/property').getValidJsPropertyName;

class NamedElement {
    /**
     * @param {*} data
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(data, namespace) {
        this._data = data;
        this._namespace = namespace;
    }

    /**
     * @return {string}
     */
    getName() {
        return _getValidJsIdentifierName(this._data.$.name);
    }

    /**
     * @return {string}
     */
    getNamespaceName() {
        return this._namespace.getName();
    }

    /**
     * @return {string}
     */
    getFullyQualifiedName() {
        return this._namespace.getName() + "." + this.getName();
    }

    /**
     * @return {*}
     */
    getData() {
        return this._data;
    }

    /**
     * @return {string}
     */
    getDocumentation() {
        if (!this._data.doc) return "";
        return this._data.doc[0]._;
    };
}

exports.NamedElement = NamedElement;