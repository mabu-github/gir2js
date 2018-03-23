const NamedTypedElement = require("./NamedTypedElement").NamedTypedElement;
const Function = require('./Function').Function;

class Field extends NamedTypedElement {
    /**
     * @param {*} field
     * @param {Namespace} namespace
     * @construct
     */
    constructor(field, namespace) {
        super(field, namespace);
        this._field = field;
    }

    /**
     * @return {boolean}
     */
    isUsable() {
        const field = this._field;
        return (!field.$.readable || field.$.readable !== "0")
            && (!field.$.private || field.$.private !== "1")
            && (!field.$.introspectable || field.$.introspectable !== "0")
            ;
    }

    /**
     * @return {boolean}
     */
    hasCallbackFunctions() {
        return !!this.getData().callback;
    }

    /**
     * @return {Array.<Function>}
     */
    getCallbackFunctions() {
        if (!this.hasCallbackFunctions())
            return [];

        return this.getData().callback.map(callback => {
            return new Function(callback, this.getNamespace());
        });
    }
}

exports.Field = Field;