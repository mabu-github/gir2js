/**
 * @param {*} func
 * @param {Namespace} namespace
 * @constructor
 */
const Function = function(func, namespace) {
    /**
     * @return {*}
     */
    this.getData = function() {
        return func;
    };
};

exports.Function = Function;