const Interface_ = require("./Interface_").Interface_;
const NamedElement = require("./NamedElement").NamedElement;
const Class = require('./Class').Class;
const Constant = require('./Constant').Constant;
const Enumeration = require('./Enumeration').Enumeration;
const Function = require('./Function').Function;

class Namespace extends NamedElement {
    /**
     * @param {*} namespace
     * @constructor
     */
    constructor(namespace) {
        super(namespace, namespace);

        /**
         * @type {boolean}
         * */
        this._initializedClassesByName = false;

        /**
         * @dict
         * @type {Object.<string, Class>}
         */
        this._classesByName = {};

        /**
         * @dict
         * @type {Object.<string, Class>}
         */
        this._interfacesByName = {};

        /**
         * @dict
         * @type {Object.<string, Function>}
         */
        this._callbackFunctionsByFullyQualifiedName = {};
    }

    initClassesByName() {
        if (this._initializedClassesByName === true)
            return;

        this.getClasses().forEach(clazz => {
            this._classesByName[clazz.getName()] = clazz;
        });

        this._initializedClassesByName = true;
    };

    initInterfacesByName() {
        if (this._initializedInterfacesByName === true)
            return;

        this.getInterfaces().forEach(interface_ => {
            this._interfacesByName[interface_.getName()] = interface_;
        });

        this._initializedInterfacesByName = true;
    };

    initCallbackFunctionsByFullyQualifiedName() {
        if (this._initializedCallbackFunctionsByFullyQualifiedName === true)
            return;

        this.getCallbackFunctions().forEach(callback => {
            this._callbackFunctionsByFullyQualifiedName[callback.getFullyQualifiedName()] = callback;
        });

        this._initializedCallbackFunctionsByFullyQualifiedName = true;
    };

    /**
     * @return {Array.<Constant>}
     */
    getConstants() {
        if (!this.getNamespace().constant)
            return [];

        return this.getNamespace().constant.map(constant => new Constant(constant, this));
    }

    /**
     * @return {Array.<Enumeration>}
     */
    getEnumerations() {
        if (!this.getNamespace().enumeration)
            return [];

        return this.getNamespace().enumeration.map(enumeration => new Enumeration(enumeration, this));
    }

    /**
     * @return {Array.<Enumeration>}
     */
    getBitfields() {
        if (!this.getNamespace().bitfield)
            return [];

        return this.getNamespace().bitfield.map(bitfield => new Enumeration(bitfield, this));
    }

    /**
     * @return {Array.<Function>}
     */
    getFunctions() {
        if (!this.getNamespace().function)
            return [];

        return this.getNamespace().function.map(func => new Function(func, this));
    }

    /**
     * @return {Array.<Function>}
     */
    getCallbackFunctions() {
        if (!this.getNamespace().callback)
            return [];

        return this.getNamespace().callback.map(func => new Function(func, this));
    }

    /**
     * @return {Array.<Interface_>}
     */
    getInterfaces() {
        if (!this.getNamespace().interface)
            return [];

        return this.getNamespace().interface.map(interface_ => new Interface_(interface_, this));
    }

    /**
     * @return {Array.<Class>}
     */
    getClasses() {
        if (!this.getNamespace().class)
            return [];

        return this.getNamespace().class.map(clazz => new Class(clazz, this));
    }

    /**
     * @param {string} name
     * @return {?Class}
     */
    getClassByName(name) {
        this.initClassesByName();
        return this._classesByName[name];
    }

    /**
     * @param {string} name
     * @return {?Class}
     */
    getInterfaceByName(name) {
        this.initInterfacesByName();
        return this._interfacesByName[name];
    }

    /**
     * @param {string} name
     * @return {?Function}
     */
    getCallbackFunctionByFullyQualifiedName(name) {
        this.initCallbackFunctionsByFullyQualifiedName();
        return this._callbackFunctionsByFullyQualifiedName[name];
    }

    getRecords() {
        if (!this.getNamespace().record)
            return [];

        return this.getNamespace().record.map(record => new Class(record, this));
    }
}

exports.Namespace = Namespace;