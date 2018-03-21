const Parameter = require("./Parameter").Parameter;

class ReturnType extends Parameter {
    /**
     * @param {*} returnValue
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(returnValue, namespace) {
        super(returnValue, namespace);
    }

    getName() {
        throw new Error("Return value does not have a name.")
    }

    getFullyQualifiedName() {
        throw new Error("Return value does not have a name.")
    }
}

exports.ReturnType = ReturnType;