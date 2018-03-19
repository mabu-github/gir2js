exports.getValidJsPropertyName = getValidJsPropertyName;

function getValidJsPropertyName(name) {
    return name.replace(/-/g, '_');
}