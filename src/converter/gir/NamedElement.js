const escapeStringRegexp = require('escape-string-regexp');

function getValidJsIdentifierName(name) {
    return name.replace(/-/g, '_');
}

function processDocumentation(doc, namespace) {
    namespace = escapeStringRegexp(namespace);
    const emphasize = function(str, toEmphasize) {
        return "_" + toEmphasize + "_";
    };
    return doc
        .replace(/@([\w\d-_]+)/g, emphasize)
        .replace(/%([\w\d-_]+)/g, emphasize)
        .replace(
            new RegExp("#(" + namespace + ")([\\w\\d]*)::?([-_\\w\\d]*)", "g"),
            function (str, namespace, clazz, method) {
                return "{@link " + namespace + "." + clazz + "#" + getValidJsIdentifierName(method) + "}";
            }
        )
        .replace(new RegExp("#(" + namespace + ")([\\w\\d]*)", "g"), "{@link $1.$2}")
        ;
}

class NamedElement {
    /**
     * @param {*} data
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(data, namespace) {
        this._data = data;
        this._namespace = namespace;
    }

    /**
     * @return {string}
     */
    getName() {
        return getValidJsIdentifierName(this._data.$.name);
    }

    /**
     * @return {Namespace}
     */
    getNamespace() {
        return this._namespace;
    }

    /**
     * @return {string}
     */
    getNamespaceName() {
        return this._namespace.getName();
    }

    /**
     * @return {string}
     */
    getFullyQualifiedName() {
        return this._namespace.getName() + "." + this.getName();
    }

    /**
     * @return {*}
     */
    getData() {
        return this._data;
    }

    /**
     * @return {string}
     */
    getDocumentation() {
        if (!this._data.doc) return "";
        return processDocumentation(this._data.doc[0]._, this.getNamespaceName());
    };
}

exports.NamedElement = NamedElement;