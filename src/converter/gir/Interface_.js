class Interface_ {
    /**
     * @param {string} name
     * @constructor
     */
    constructor(name) {
        this._name = name;
    }

    getName() {
        return this._name;
    }
}

exports.Interface_ = Interface_;