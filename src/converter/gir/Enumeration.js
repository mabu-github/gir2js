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
        const self = this;
        return this._enumeration.member.map(function(enumMember) {
            return new EnumerationMember(enumMember, self.getNamespace());
        })
    }
}

class EnumerationMember extends NamedElement {
    /**
     * @param {*} enumMember
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(enumMember, namespace) {
        super(enumMember, namespace);
        this._enumMember = enumMember;
    }

    /**
     * @return {string}
     */
    getName() {
        return super.getName().toUpperCase();
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