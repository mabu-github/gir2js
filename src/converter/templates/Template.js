const readFile = require('fs').readFileSync;
const Mustache = require('mustache');

Mustache.escape = function(value) {
    return value;
};

Mustache.tags = ['<%', '%>'];

let Template = {
    TPL_NAMESPACE: __dirname + "/namespace.mustache",
    TPL_VARIABLE_ASSIGNMENT: __dirname + "/variableAssignment.mustache",
    TPL_TYPED_DOC_TAG: __dirname + "/typedDocTag.mustache",
    TPL_LITERAL_OBJECT: __dirname + "/literalObject.mustache",
    TPL_METHOD: __dirname + "/method.mustache",

    templates: {},

    renderFile: function(file, view) {
        if (!this.templates[file]) {
            this.templates[file] = readFile(file).toString();
            Mustache.parse(this.templates[file]);
        }

        return Mustache.render(this.templates[file], view)
    },

    /**
     * @typedef {{name: string, definition: string, documentation: string}} _PropertyType
     * @param {Array.<_PropertyType>} properties
     * @return string
     */
    literalObject: function(properties) {
        properties[properties.length-1].last = true;
        return this.renderFile(this.TPL_LITERAL_OBJECT, {properties: properties});
    },

    /**
     * @param {string} name
     * @return {string}
     */
    namespace: function(name) {
        return this.renderFile(this.TPL_NAMESPACE, {namespace: name});
    },

    /**
     * @typedef {{name: string}} _ParameterType
     * @param {{documentation: Array.<string>, signature: Array.<string>, prefix: string, method: string, parameters: Array<_ParameterType>}} view
     * @return {string}
     */
    method: function(view) {
        if (view.parameters.length >= 1) {
            view.parameters[view.parameters.length-1].last = true;
        }
        return this.renderFile(this.TPL_METHOD, view);
    },

    /**
     * @param {{documentation: Array.<string>, signature: Array.<string>, prefix: string, variable: string, assignment: string}} view
     * @return {string}
     */
    variableAssignment: function(view) {
        return this.renderFile(this.TPL_VARIABLE_ASSIGNMENT, view);
    },

    /**
     * @param {{tag: string, type: string, parameter: string, documentation: Array.<string>}} view
     * @return {string}
     */
    typedDocTag: function(view) {
        return this.renderFile(this.TPL_TYPED_DOC_TAG, view);
    }
};

exports.Template = Template;