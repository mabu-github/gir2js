const NamedTypedElement = require("./NamedTypedElement").NamedTypedElement;

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
}

exports.Field = Field;