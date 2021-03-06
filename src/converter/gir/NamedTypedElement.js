const NamedElement = require('./NamedElement').NamedElement;

/**
 * @param {*} parameter
 * @param {NamedElement} namedElement
 * @returns {string}
 */
function getParameterType(parameter, namedElement) {
    const namespace = namedElement.getNamespaceName();

    if (parameter.varargs) {
        return "...*";
    }
    if (parameter.array) {
        return "Array.<" + getParameterType(parameter.array[0], namedElement) + ">";
    }
    if (parameter.callback) {
        throw new Exception("Cannot handle callback type here because an additional corresponding docblock needs to be generated");
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
            return parameterType;
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
}

function getTypesWithoutJsEquivalent() {
    return [
        '__non_introspectable_type__',
        '__non_introspectable_varargs_type__',
        'gpointer',
        'gconstpointer',
        'gintptr',
        'guintptr'
    ];
}

class NamedTypedElement extends NamedElement {
    /**
     * @param {*} data
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(data, namespace) {
        super(data, namespace);
        this._data = data;
        this._namespace = namespace;
    }

    /**
     * @return {string}
     */
    getType() {
        const parameterType = getParameterType(this.getData(), this);

        // handle typename transformation for callbacks in namespace
        if (this._namespace.getCallbackFunctionByFullyQualifiedName(parameterType)) {
            return parameterType.replace(/\./g, "_");
        }

        return parameterType;
    }
}

exports.NamedTypedElement = NamedTypedElement;
exports.getTypesWithoutJsEquivalent = getTypesWithoutJsEquivalent;