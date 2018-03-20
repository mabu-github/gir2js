const Property = require('./Property').Property;
const Function = require('./Function').Function;
const NamedElement = require('./NamedElement').NamedElement;

class Class extends NamedElement {
    /**
     * @param {*} clazz
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(clazz, namespace) {
        super(clazz, namespace);
        this._clazz = clazz;
        this._namespace = namespace;
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

        return this._namespace.getClassByName(this._clazz.$.parent);
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
            return new Property(property, self._namespace);
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
     * @return {Array.<Function>}
     */
    getFunctions() {
        let functions = [];

        if (this._clazz.method) { // instance method
            functions = functions.concat(this._clazz.method);
        }
        if (this._clazz.function) // static method
            functions = functions.concat(this._clazz.function);

        const self = this;
        return functions.map(function(func) {
            return new Function(func, self);
        });
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