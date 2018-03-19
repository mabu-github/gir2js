const Class = require('./Class').Class;
const Constant = require('./Constant').Constant;
const Enumeration = require('./Enumeration').Enumeration;
const Function = require('./Function').Function;

/**
 * @param {*} namespace
 * @constructor
 */
const Namespace = function(namespace) {

    /**
     * @type {boolean}
     */
    let initialized = false;

    /**
     * @dict
     * @type {Object.<string, Class>}
     */
    let classesByName = {};

    this.init = function() {
        if (initialized === true)
            return;

        this.getClasses().forEach(function(clazz) {
            classesByName[clazz.getName()] = clazz;
        });

        this.initialized = true;
    };

    /**
     * @return {string}
     */
    this.getName = function() {
        return namespace.$.name;
    };

    /**
     * @return {*}
     */
    this.getData = function() {
        return namespace;
    };

    /**
     * @return {Array.<Constant>}
     */
    this.getConstants = function() {
        if (!namespace.constant)
            return [];

        const self = this;
        return namespace.constant.map(function(constant) {
            return new Constant(constant, self);
        });
    };

    /**
     * @return {Array.<Enumeration>}
     */
    this.getEnumerations = function() {
        if (!namespace.enumeration)
            return [];

        const self = this;
        return namespace.enumeration.map(function(enumeration) {
            return new Enumeration(enumeration, self);
        });
    };

    /**
     * @return {Array.<Enumeration>}
     */
    this.getBitfields = function() {
        if (!namespace.bitfield)
            return [];

        const self = this;
        return namespace.bitfield.map(function(bitfield) {
            return new Enumeration(bitfield, self);
        });
    };

    /**
     * @return {Array.<Function>}
     */
    this.getFunctions = function() {
        if (!namespace.function)
            return [];

        const self = this;
        return namespace.function.map(function(func) {
            return new Function(func, self);
        });
    };

    /**
     * @return {Array.<Class>}
     */
    this.getClasses = function() {
        if (!namespace.class)
            return [];

        const self = this;
        return namespace.class.map(function(clazz) {
            return new Class(clazz, self);
        });
    };

    /**
     * @param {string} name
     * @returns {Class}
     */
    this.getClassByName = function(name) {
        this.init();
        return classesByName[name];
    };
};

exports.Namespace = Namespace;