const _getParameterType = require('../conversions/glibBasicTypes').getParameterType;
const _getValidJsPropertyName = require('../conversions/property').getValidJsPropertyName;

/**
 * @param {*} enumeration
 * @param {Namespace} namespace
 * @constructor
 */
const Enumeration = function(enumeration, namespace) {
    /**
     * @return {string}
     */
    this.getName = function() {
        return _getValidJsPropertyName(enumeration.$.name);
    };

    /**
     * @return {string}
     */
    this.getDocumentation = function() {
        if (!enumeration.doc) return "";
        return enumeration.doc[0]._;
    };

    /**
     * @return {*}
     */
    this.getData = function() {
        return enumeration;
    };

    /**
     * @return {string}
     */
    this.getType = function() {
        return _getParameterType(enumeration, namespace.getName())
    };

    /**
     * @return {Array.<EnumerationMember>}
     */
    this.getMembers = function() {
        return enumeration.member.map(function(enumMember) {
            return new EnumerationMember(enumMember, namespace);
        })
    }
};

/**
 * @param {*} enumMember
 * @param {Namespace} namespace
 * @constructor
 */
const EnumerationMember = function(enumMember, namespace) {

    /**
     * @return {string}
     */
    this.getName = function() {
        return enumMember.$.name.toUpperCase();
    };

    /**
     * @return {string} Printable value for JS Code. "value" for strings, the value as is otherwise.
     */
    this.getValue = function() {
        return enumMember.$.value;
    };

    /**
     * @return {string}
     */
    this.getDocumentation = function() {
        if (!enumMember.doc) return "";
        return enumMember.doc[0]._;
    };
};

exports.Enumeration = Enumeration;
exports.EnumerationMember = EnumerationMember;