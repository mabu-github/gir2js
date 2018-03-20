const Property = require('./Property').Property;
const Function = require('./Function').Function;

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
     * @return {string}
     */
    this.getFullyQualifiedName = function() {
        return namespace.getName() + "." + this.getName();
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
            console.warn("Cannot handle parent type '" + clazz.$.parent + "' outside of current namespace.");
            return new ClassOutsideNamespace(clazz);
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

    /**
     * @return {Array.<Function>}
     */
    this.getFunctions = function() {
        let functions = [];

        if (clazz.method) {
            functions = functions.concat(clazz.method);
        }
        if (clazz.function)
            functions = functions.concat(clazz.function);

        const self = this;
        return functions.map(function(func) {
            return new Function(func, self);
        });
    };
};

/**
 * @augments Class
 * @constructor
 */
const ClassOutsideNamespace = function(clazz) {
    this.getFullyQualifiedName = function() {
        return clazz.$.parent;
    };
    this.getParent = function() {
        return null;
    };
    this.getOwnProperties = function() {
        return [];
    }
};
ClassOutsideNamespace.prototype = new Class(null, null);

exports.Class = Class;
exports.ClassOutsideNamespace = ClassOutsideNamespace;