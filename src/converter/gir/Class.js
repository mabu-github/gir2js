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
     * @return {?Class}
     */
    this.getParent = function() {
        if (!clazz.$.parent)
            return null;

        if (clazz.$.parent.indexOf(".") > -1) {
            console.warn("Cannot handle parent type outside of current namespace.");
            return null;
        }

        return namespace.getClassByName(clazz.$.parent);
    };

    /**
     * @return {Array.<Class>}
     */
    this.getParents = function() {
        let parents = [];

        let current = this;
        while (current !== null) {
            let parent = current.getParent();
            if (parent !== null) {
                parents.push(parent);
            }
            current = parent;
        }

        return parents;
    };

    /**
     * @return {Array.<Property>}
     */
    this.getOwnProperties = function() {
        if (!clazz.property) return [];

        return clazz.property.map(function(property) {
            return new Property(property, namespace);
        });
    };

    /**
     * @return {Array.<Property>}
     */
    this.getAllProperties = function() {
        let properties = [];
        const classes = [this].concat(this.getParents());
        classes.forEach(function(clazz) {
            properties = properties.concat(clazz.getOwnProperties());
        });
        return properties;
    };
};

exports.Class = Class;