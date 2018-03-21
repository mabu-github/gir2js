const NamedTypedElement = require('./NamedTypedElement').NamedTypedElement;

class Constant extends NamedTypedElement {
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
     * @return {string} Printable value for JS Code. "value" for strings, the value as is otherwise.
     */
    getValue() {
        let value = "";
        if (this.getType() === "string") {
            value = '"' + this._constant.$.value + '"';
        } else {
            value = this._constant.$.value;
        }
        return value;
    }
}

exports.Constant = Constant;