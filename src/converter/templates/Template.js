const readFile = require('fs').readFileSync;
const Mustache = require('mustache');

Mustache.escape = function(value) {
    return value;
};

let Template = {
    TPL_NAMESPACE: __dirname + "/namespace.mustache",
    TPL_VARIABLE_ASSIGNMENT: __dirname + "/variableAssignment.mustache",

    templates: {},

    renderFile: function(file, view) {
        if (!this.templates[file]) {
            this.templates[file] = readFile(file).toString();
            Mustache.parse(this.templates[file]);
        }

        return Mustache.render(this.templates[file], view)
    }
};

exports.Template = Template;