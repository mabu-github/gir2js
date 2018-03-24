const Field = require("./Field").Field;
const Signal = require("./Signal").Signal;
const Constructor = require("./Constructor").Constructor;
const Property = require('./Property').Property;
const Function = require('./Function').Function;
const NamedElement = require('./NamedElement').NamedElement;

/**
 * @param {*} functions
 * @param {Namespace} namespace
 * @return {Array.<Function>}
 */
function mapFunctions(functions, namespace) {
    return functions.map(func => new Function(func, namespace));
}

/**
 * @template T
 * @param {Array.<T>} list
 * @param {function(T):string} getEqualityAttributeValue
 * @returns {Array.<T>}
 */
function removeDuplicates(list, getEqualityAttributeValue) {
    const items = list.map(getEqualityAttributeValue);

    let duplicateIdxs = [];
    items.reverse().forEach((item, idx, items) => {
        if (items.indexOf(item, idx+1) > -1) {
            duplicateIdxs.push(items.length - idx - 1);
        }
    });
    duplicateIdxs.reverse();

    if (duplicateIdxs.length === 0)
        return list;

    let withoutDuplicates = [];
    let j = 0;
    for (let i = 0; i < list.length; i++) {
        if (duplicateIdxs[j] === i) {
            if (j < duplicateIdxs.length - 1) {
                j++;
            }
            continue;
        }
        withoutDuplicates.push(list[i]);
    }

    return withoutDuplicates;
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
     * @return {?string}
     */
    getFullyQualifiedParentName() {
        if (!this._clazz.$.parent)
            return null;

        if (this._clazz.$.parent.indexOf(".") === -1) {
            return this.getNamespaceName() + "." + this._clazz.$.parent;
        }

        return this._clazz.$.parent;
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
     * @return {Array.<Class>}
     */
    getImplementedInterfaces() {
        const self = this;
        return this.getImplementedInterfaceNames().map(interfaceName => {
            if (interfaceName.indexOf(".") > -1) {
                console.warn("Cannot handle parent interface type '" + interfaceName + "' outside of current namespace.");
                return new ClassOutsideNamespace(interfaceName);
            }

            return self.getNamespace().getInterfaceByName(interfaceName);
        });
    }

    /**
     * @return {Array.<string>}
     */
    getImplementedInterfaceNames() {
        if (!this._clazz.implements)
            return [];

        return this._clazz.implements.map(interface_ => interface_.$.name);
    }

    /**
     * @return {Array.<Property>}
     */
    getOwnProperties() {
        if (!this._clazz.property)
            return [];

        return this._clazz.property.map(property => new Property(property, this.getNamespace()));
    }

    /**
     * @return {Array.<Property>}
     */
    getAllProperties() {
        let properties = [];
        const classes = [this]
            .concat(this.getParents())
            .concat(this.getImplementedInterfaces());
        classes.forEach(clazz => {
            properties = properties.concat(clazz.getOwnProperties());
        });
        return removeDuplicates(properties, property => property.getName());
    }

    /**
     * @return {Array.<Field>}
     */
    getFields() {
        if (!this._clazz.field)
            return [];

        return this._clazz.field.map(field => new Field(field, this.getNamespace()));
    }

    /**
     * @return {Array.<Signal>}
     */
    getOwnSignals() {
        if (!this._clazz['glib:signal'])
            return [];

        return this._clazz['glib:signal'].map(signal => new Signal(signal, this.getNamespace()));
    }

    /**
     * @return {Array.<Signal>}
     */
    getAllSignals() {
        let signals = [];
        const classes = [this]
            .concat(this.getParents())
            .concat(this.getImplementedInterfaces());
        classes.forEach(clazz => {
            signals = signals.concat(clazz.getOwnSignals());
        });
        return signals;
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
        const allMethodsContainingDuplicates = []
            .concat(this.getConstructors())
            .concat(this.getInstanceMethods())
            .concat(this.getStaticMethods())
            .concat(this.getVirtualMethods())
            ;

        return removeDuplicates(allMethodsContainingDuplicates, method => method.getName());
    }

    /**
     * @return {boolean}
     */
    isUsable() {
        return (!this._clazz.$.disguised || this._clazz.$.disguised !== "1");
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

    getOwnSignals() {
        return [];
    }
}

exports.Class = Class;