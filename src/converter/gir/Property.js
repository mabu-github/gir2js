const _getParameterType = require('../conversions/glibBasicTypes').getParameterType;
const _getValidJsPropertyName = require('../conversions/property').getValidJsPropertyName;

/**
 * @param {*} property
 * @param {Namespace} namespace
 * @constructor
 */
const Property = function(property, namespace) {
    /**
     * @return {string}
     */
    this.getName = function() {
        return _getValidJsPropertyName(property.$.name);
    };

    /**
     * @return {*}
     */
    this.getData = function() {
        return property;
    };

    /**
     * @return {string}
     */
    this.getParameterType = function() {
        return _getParameterType(property, namespace.getName())
    };
};

exports.Property = Property;