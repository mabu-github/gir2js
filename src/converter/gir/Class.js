const Signal = require("./Signal").Signal;
const Constructor = require("./Constructor").Constructor;
const Property = require('./Property').Property;
const Function = require('./Function').Function;
const NamedElement = require('./NamedElement').NamedElement;

/**
 * @param {*} functions
 * @param {Namespace} namespace
 * @returns {Array.<Function>}
 */
function mapFunctions(functions, namespace) {
    return functions.map(function(func) {
        return new Function(func, namespace);
    });
}

class Class extends NamedElement {
    /**
     * @param {*} clazz
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(clazz, namespace) {
        super(clazz, namespace);
        this._clazz = clazz;
    }

    /**
     * @return {Array.<Constructor>}
     */
    getConstructors() {
        // first constructor belongs to JavaScript internals,
        // starting from second belongs to class definition

        if (this._clazz.constructor.length === 1)
            return [];

        return mapFunctions(this._clazz.constructor.slice(1), this.getNamespace());
    }


    /**
     * @return {?Class}
     */
    getParent() {
        if (!this._clazz.$.parent)
            return null;

        if (this._clazz.$.parent.indexOf(".") > -1) {
            console.warn("Cannot handle parent type '" + this._clazz.$.parent + "' outside of current namespace.");
            return new ClassOutsideNamespace(this._clazz.$.parent);
        }

        return this.getNamespace().getClassByName(this._clazz.$.parent);
    }

    /**
     * @return {Array.<Class>}
     */
    getParents() {
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
    }

    /**
     * @return {Array.<Property>}
     */
    getOwnProperties() {
        if (!this._clazz.property) return [];

        const self = this;
        return this._clazz.property.map(function(property) {
            return new Property(property, self.getNamespace());
        });
    }

    /**
     * @return {Array.<Property>}
     */
    getAllProperties() {
        let properties = [];
        const classes = [this].concat(this.getParents());
        classes.forEach(function(clazz) {
            properties = properties.concat(clazz.getOwnProperties());
        });
        return properties;
    }

    /**
     * @return {Array.<Signal>}
     */
    getSignals() {
        if (!this._clazz['glib:signal'])
            return [];

        const self = this;
        return this._clazz['glib:signal'].map(function(signal) {
            return new Signal(signal, self.getNamespace());
        });
    }

    /**
     * @return {Array.<Function>}
     */
    getInstanceMethods() {
        if (!this._clazz.method)
            return [];

        return mapFunctions(this._clazz.method, this.getNamespace());
    }

    /**
     * @return {Array.<Function>}
     */
    getStaticMethods() {
        if (!this._clazz.function)
            return [];

        return mapFunctions(this._clazz.function, this.getNamespace());
    }

    /**
     * @return {Array.<Function>}
     */
    getVirtualMethods() {
        if (!this._clazz['virtual-method'])
            return [];

        return mapFunctions(this._clazz['virtual-method'], this.getNamespace());
    }

    /**
     * @return {Array.<Function>}
     */
    getAllFunctions() {
        return []
            .concat(this.getConstructors())
            .concat(this.getInstanceMethods())
            .concat(this.getStaticMethods())
            .concat(this.getVirtualMethods())
            ;
    }
}

class ClassOutsideNamespace extends Class {
    /**
     * @param {string} fullyQualifiedName
     * @constructor
     */
    constructor(fullyQualifiedName) {
        super(null, null);
        this._name = fullyQualifiedName;
    }

    getFullyQualifiedName() {
        return this._name;
    }

    getParent() {
        return null;
    }

    getOwnProperties() {
        return [];
    }
}

exports.Class = Class;