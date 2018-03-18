exports.getParameterType = function(parameter, namespace) {
    if (parameter.varargs) {
        return "...*";
    }
    if (parameter.array) {
        return "Array.<" + exports.getParameterType(parameter.array[0], namespace) + ">";
    }
    if (!parameter.type[0].$) {
        console.warn("Found non introspectable type");
        return "__non_introspectable_type__";
    }

    const parameterType = parameter.type[0].$.name;
    let convertedParameterType = "";
    if (parameterType === "utf8"
        || parameterType === "gchar"
        || parameterType === "guchar"
        || parameterType === "gunichar") {
        convertedParameterType = "string";
    } else if (parameterType === "gdouble"
        || parameterType === "gfloat"
        || parameterType === "gshort"
        || parameterType === "gushort"
        || parameterType === "gint"
        || parameterType === "guint"
        || parameterType === "glong"
        || parameterType === "gulong"
        || parameterType === "gint8"
        || parameterType === "guint8"
        || parameterType === "gint16"
        || parameterType === "guint16"
        || parameterType === "gint32"
        || parameterType === "guint32"
        || parameterType === "gint64"
        || parameterType === "guint64"
        || parameterType === "gsize"
        || parameterType === "gssize"
        || parameterType === "goffset"
    ) {
        convertedParameterType = "number";
    } else if (parameterType === "gboolean") {
        convertedParameterType = "boolean";
    } else {
        if (exports.getTypesWithoutJsEquivalent().includes(parameterType)) {
            console.warn("Could not convert " + parameterType + " to JavaScript");
        } else if (parameterType.startsWith("g")) {
            throw new TypeError("Cannot handle glib type " + parameterType);
        }
        if (parameterType.indexOf(".") > -1) {
            convertedParameterType = parameterType;
        } else {
            convertedParameterType = namespace + "." + parameterType;
        }
    }
    return convertedParameterType;
};

exports.getTypesWithoutJsEquivalent = function() {
    return [
        '__non_introspectable_type__',
        '__non_introspectable_varargs_type__',
        'gpointer',
        'gconstpointer',
        'gintptr',
        'guintptr'
    ];
};