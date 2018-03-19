/**
 * @param {*} parameter
 * @param {Namespace} namespace
 * @constructor
 */
const Parameter = function(parameter, namespace) {
    /**
     * @return {string}
     */
    this.getName = function() {
        return parameter.$.name;
    };

    /**
     * @return {*}
     */
    this.getData = function() {
        return parameter;
    };

    /**
     * @return {string}
     */
    this.getDocumentation = function() {
        if (!parameter.doc) return "";
        return parameter.doc[0]._;
    };
};

exports.Parameter = Parameter;