const Property = require('./Property').Property;

/**
 * @param {*} clazz
 * @param {Namespace} namespace
 * @constructor
 */
const Class = function(clazz, namespace) {
    /**
     * @return {string}
     */
    this.getName = function() {
        return clazz.$.name;
    };

    /**
     * @return {*}
     */
    this.getData = function() {
        return clazz;
    };

    /**
     * @return {Array.<Property>}
     */
    this.getProperties = function() {
        if (!clazz.property) return [];

        return clazz.property.map(function(property) {
            return new Property(property);
        });
    };
};

exports.Class = Class;