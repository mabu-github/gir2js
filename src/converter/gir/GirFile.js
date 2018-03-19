/**
 * @param {*} girFile
 * @constructor
 */
const GirFile = function(girFile) {
    const repository = girFile.repository;
    const namespaces = repository.namespace;

    /**
     * @return {Array.<Namespace>}
     */
    this.getNamespaces = function () {
        return namespaces.map(function(namespace) {
            return new Namespace(namespace);
        });
    };
};

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
};

exports.GirFile = GirFile;