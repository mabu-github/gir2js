const Parameter = require("./Parameter").Parameter;

/**
 * @param {*} func
 * @param {Namespace} namespace
 * @constructor
 */
const Function = function(func, namespace) {
    /**
     * @return {string}
     */
    this.getName = function() {
        return func.$.name;
    };

    /**
     * @return {*}
     */
    this.getData = function() {
        return func;
    };

    /**
     * @return {string}
     */
    this.getDocumentation = function() {
        if (!func.doc) return "";
        return func.doc[0]._;
    };

    /**
     * @return {Array.<Parameter>}
     */
    this.getParameters = function() {
        if (!(func.parameters && func.parameters[0].parameter))
            return [];

        return func.parameters[0].parameter.map(function(parameter) {
            return new Parameter(parameter, namespace);
        });
    };
};

exports.Function = Function;