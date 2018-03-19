/**
 * @param {*} property
 * @constructor
 */
const Property = function(property) {
    /**
     * @return {string}
     */
    this.getName = function() {
        return property.$.name;
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

    };
};

exports.Property = Property;