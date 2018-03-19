const Class = require('./Class').Class;

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
     * @return {Array.<Class>}
     */
    this.getClasses = function() {
        if (!namespace.class)
            return [];

        return namespace.class.map(function(clazz) {
            return new Class(clazz, namespace);
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