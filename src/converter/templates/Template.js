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
const TPL_CALLBACK = __dirname + "/callback.mustache";
const TPL_CLASS = __dirname + "/class.mustache";
const TPL_SIGNAL_TYPE = __dirname + "/signalType.mustache";

let templates = {};
function renderFile(file, view) {
    if (!templates[file]) {
        templates[file] = readFile(file).toString();
        Mustache.parse(templates[file]);
    }

    return Mustache.render(templates[file], view)
}

const Template = {
    /**
     * @typedef {{name: string, definition: string, documentation: Array.<string>}} _PropertyType
     * @param {Array.<_PropertyType>} properties
     * @return string
     */
    literalObject: function(properties) {
        properties[properties.length-1].last = true;
        properties.forEach(property => {
            property.docBlock = !!property.documentation.join("\n");
        });
        return renderFile(TPL_LITERAL_OBJECT, {properties: properties});
    },

    /**
     * @param {string} name
     * @return {string}
     */
    namespace: function(name) {
        return renderFile(TPL_NAMESPACE, {namespace: name});
    },

    /**
     * @typedef {{name: string}} _ParameterType
     * @param {{documentation: Array.<string>, signature: Array.<string>, prefix: string, method: string, parameters: Array<_ParameterType>}} view
     * @return {string}
     */
    method: function(view) {
        view.documentationAvailable = !!view.documentation.join("\n");
        if (view.parameters.length >= 1) {
            view.parameters[view.parameters.length-1].last = true;
        }
        return renderFile(TPL_METHOD, view);
    },

    /**
     * @typedef {{name: string}} _ParameterType
     * @param {{documentation: Array.<string>, signature: Array.<string>}} view
     * @return {string}
     */
    callback: function(view) {
        view.documentationAvailable = !!view.documentation.join("\n");
        return renderFile(TPL_CALLBACK, view);
    },

    /**
     * @param {{documentation: Array.<string>, signature: Array.<string>, prefix: string, variable: string, assignment: string}} view
     * @return {string}
     */
    variableAssignment: function(view) {
        view.docBlock = !((!view.documentation || !view.documentation.join("\n")) && !view.signature);
        view.documentationAvailable = !!view.documentation && !!view.documentation.join("\n");

        return renderFile(TPL_VARIABLE_ASSIGNMENT, view);
    },

    /**
     * @param {{tag: string, type: string, parameter: string, documentation: Array.<string>}} view
     * @return {string}
     */
    typedDocTag: function(view) {
        return renderFile(TPL_TYPED_DOC_TAG, view);
    },

    /**
     * @typedef {{name: string, type: string}} _ConstructorParameterType
     * @param {{
     *  documentation: Array.<string>,
     *  [constructorParameters]: Array<_ConstructorParameterType>
     *  [prefix]: string,
     *  class: string,
     *  [extends]: ?string,
     *  [abstract]: boolean
     *  [implements]: Array.<string>,
     *  classBody: string,
     *  [variableSpecifier]: string
     *  }} view
     * @return {string}
     */
    class: function(view) {
        if (!view.constructorParameters) {
            view.constructorParameters = [];
        }
        view.documentationAvailable = !!view.documentation.join("\n");
        if (view.constructorParameters.length >= 1) {
            view.constructorParameters[view.constructorParameters.length-1].last = true;
            view.constructorHasParameters = true;
        }
        if (view.prefix) {
            view.hasPrefix = true;
        }
        if (view.variableSpecifier) {
            view.introduceVariable = true;
        }

        return renderFile(TPL_CLASS, view);
    },

    signalType: function() {
        return renderFile(TPL_SIGNAL_TYPE);
    }
};

exports.Template = Template;