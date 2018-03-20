const readFile = require('fs').readFileSync;
const Mustache = require('mustache');

Mustache.escape = function(value) {
    return value;
};

Mustache.tags = ['<%', '%>'];

const TPL_NAMESPACE = __dirname + "/namespace.mustache";
const TPL_VARIABLE_ASSIGNMENT = __dirname + "/variableAssignment.mustache";
const TPL_TYPED_DOC_TAG = __dirname + "/typedDocTag.mustache";
const TPL_LITERAL_OBJECT = __dirname + "/literalObject.mustache";
const TPL_METHOD = __dirname + "/method.mustache";

let templates = {};
function renderFile(file, view) {
    if (!templates[file]) {
        templates[file] = readFile(file).toString();
        Mustache.parse(templates[file]);
    }

    return Mustache.render(templates[file], view)
}

let Template = {
    /**
     * @typedef {{name: string, definition: string, documentation: string}} _PropertyType
     * @param {Array.<_PropertyType>} properties
     * @return string
     */
    literalObject: function(properties) {
        properties[properties.length-1].last = true;
        return this.renderFile(TPL_LITERAL_OBJECT, {properties: properties});
    },

    /**
     * @param {string} name
     * @return {string}
     */
    namespace: function(name) {
        return this.renderFile(TPL_NAMESPACE, {namespace: name});
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
        return this.renderFile(TPL_METHOD, view);
    },

    /**
     * @param {{documentation: Array.<string>, signature: Array.<string>, prefix: string, variable: string, assignment: string}} view
     * @return {string}
     */
    variableAssignment: function(view) {
        return this.renderFile(TPL_VARIABLE_ASSIGNMENT, view);
    },

    /**
     * @param {{tag: string, type: string, parameter: string, documentation: Array.<string>}} view
     * @return {string}
     */
    typedDocTag: function(view) {
        return this.renderFile(TPL_TYPED_DOC_TAG, view);
    }
};

exports.Template = Template;