const _getParameterType = require('../conversions/glibBasicTypes').getParameterType;
const NamedElement = require('./NamedElement').NamedElement;

class Constant extends NamedElement {
    /**
     * @param {*} constant
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(constant, namespace) {
        super(constant, namespace);
        this._constant = constant;
    }

    /**
     * @return {string}
     */
    getType() {
        return _getParameterType(this._constant, this.getNamespaceName())
    }

    /**
     * @return {string} Printable value for JS Code. "value" for strings, the value as is otherwise.
     */
    getValue() {
        let value = "";
        if (_getParameterType(this._constant, this.getNamespaceName()) === "string") {
            value = '"' + this._constant.$.value + '"';
        } else {
            value = this._constant.$.value;
        }
        return value;
    }
}

exports.Constant = Constant;