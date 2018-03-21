const ReturnType = require("./ReturnType").ReturnType;
const NamedElement = require("./NamedElement").NamedElement;
const Parameter = require("./Parameter").Parameter;

class Function extends NamedElement {
    /**
     * @param {*} func
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(func, namespace) {
        super(func, namespace);
        this._func = func;
    }

    /**
     * @return {Array.<Parameter>}
     */
    getParameters() {
        if (!(this._func.parameters && this._func.parameters[0].parameter))
            return [];

        const self = this;
        return this._func.parameters[0].parameter.map(function(parameter) {
            return new Parameter(parameter, self.getNamespace());
        });
    }

    /**
     * @return {?ReturnType}
     */
    getReturnType() {
        if (!this._func['return-value']
            || (/* void */ this._func['return-value'][0].type
                && this._func['return-value'][0].type[0].$.name === "none")
        ) {
            return null;
        }

        return new ReturnType(this._func['return-value'][0], this.getNamespace());
    }
}

exports.Function = Function;