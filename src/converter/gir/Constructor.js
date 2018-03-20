class Constructor {
    /**
     * @param {*} constructor
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(constructor, namespace) {
        this._constructor = constructor;
        this._namespace = namespace;
    }

    /**
     * @return {string}
     */
    getData() {
        return this._constructor;
    }
}

exports.Constructor = Constructor;