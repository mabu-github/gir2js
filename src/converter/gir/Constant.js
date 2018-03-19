const _getParameterType = require('../conversions/glibBasicTypes').getParameterType;
const _getValidJsPropertyName = require('../conversions/property').getValidJsPropertyName;

/**
 * @param {*} constant
 * @param {Namespace} namespace
 * @constructor
 */
const Constant = function(constant, namespace) {
    /**
     * @return {string}
     */
    this.getName = function() {
        return _getValidJsPropertyName(constant.$.name);
    };

    /**
     * @return {string}
     */
    this.getDocumentation = function() {
        if (!constant.doc) return "";
        return constant.doc[0]._;
    };

    /**
     * @return {*}
     */
    this.getData = function() {
        return constant;
    };

    /**
     * @return {string}
     */
    this.getType = function() {
        return _getParameterType(constant, namespace.getName())
    };

    /**
     * @return {string} Printable value for JS Code. "value" for strings, the value as is otherwise.
     */
    this.getValue = function() {
        let value = "";
        if (_getParameterType(constant, namespace.getName()) === "string") {
            value = '"' + constant.$.value + '"';
        } else {
            value = constant.$.value;
        }
        return value;
    }
};

exports.Constant = Constant;