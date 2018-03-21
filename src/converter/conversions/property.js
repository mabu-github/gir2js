function getValidJsPropertyName(name) {
    return name.replace(/-/g, '_');
}

exports.getValidJsPropertyName = getValidJsPropertyName;