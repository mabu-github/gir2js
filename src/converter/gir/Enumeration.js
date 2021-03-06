const NamedElement = require('./NamedElement').NamedElement;
const NamedTypedElement = require('./NamedTypedElement').NamedTypedElement;


class Enumeration extends NamedTypedElement {
    /**
     * @param {*} enumeration
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(enumeration, namespace) {
        super(enumeration, namespace);
        this._enumeration = enumeration;
    }

    /**
     * @return {Array.<EnumerationMember>}
     */
    getMembers() {
        return this._enumeration.member.map(enumMember => new EnumerationMember(enumMember, this.getNamespace()));
    }
}

class EnumerationMember extends NamedElement {
    /**
     * @param {*} enumMember
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(enumMember, namespace) {
        enumMember.$.name = enumMember.$.name.toUpperCase();
        super(enumMember, namespace);
        this._enumMember = enumMember;
    }

    /**
     * @return {string} Printable value for JS Code. "value" for strings, the value as is otherwise.
     */
    getValue() {
        return this._enumMember.$.value;
    }
}

exports.Enumeration = Enumeration;
exports.EnumerationMember = EnumerationMember;