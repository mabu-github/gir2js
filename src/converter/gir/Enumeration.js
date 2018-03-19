const _getParameterType = require('../conversions/glibBasicTypes').getParameterType;
const _getValidJsPropertyName = require('../conversions/property').getValidJsPropertyName;

/**
 * @param {*} enumeration
 * @param {Namespace} namespace
 * @constructor
 */
const Enumeration = function(enumeration, namespace) {
    /**
     * @return {string}
     */
    this.getName = function() {
        return _getValidJsPropertyName(enumeration.$.name);
    };

    /**
     * @return {string}
     */
    this.getDocumentation = function() {
        if (!enumeration.doc) return "";
        return enumeration.doc[0]._;
    };

    /**
     * @return {*}
     */
    this.getData = function() {
        return enumeration;
    };

    /**
     * @return {string}
     */
    this.getType = function() {
        return _getParameterType(enumeration, namespace.getName())
    };

    /**
     * @return {string} Printable value for JS Code. "value" for strings, the value as is otherwise.
     */
    this.getValue = function() {
        let value = "";
        if (_getParameterType(enumeration, namespace.getName()) === "string") {
            value = '"' + enumeration.$.value + '"';
        } else {
            value = enumeration.$.value;
        }
        return value;
    }
};

exports.Enumeration = Enumeration;