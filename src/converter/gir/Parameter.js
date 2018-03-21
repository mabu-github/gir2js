const NamedTypedElement = require("./NamedTypedElement").NamedTypedElement;

function transformJsKeywords(token, prepend="", append="") {
    const keywords = [
        'do',
        'if',
        'in',
        'for',
        'let',
        'new',
        'try',
        'var',
        'case',
        'else',
        'enum',
        'eval',
        'null',
        'this',
        'true',
        'void',
        'with',
        'await',
        'break',
        'catch',
        'class',
        'const',
        'false',
        'super',
        'throw',
        'while',
        'yield',
        'delete',
        'export',
        'import',
        'public',
        'return',
        'static',
        'switch',
        'typeof',
        'default',
        'extends',
        'finally',
        'package',
        'private',
        'continue',
        'debugger',
        'function',
        'arguments',
        'interface',
        'protected',
        'implements',
        'instanceof'
    ];

    if (!keywords.includes(token)) {
        return token;
    }

    return prepend + token + append;
}

class Parameter extends NamedTypedElement {
    /**
     * @param {*} parameter
     * @param {Namespace} namespace
     * @constructor
     */
    constructor(parameter, namespace) {
        if (parameter.$) {
            parameter.$.name = transformJsKeywords(parameter.$.name, "", "_");
        }
        super(parameter, namespace);
    }
}

exports.Parameter = Parameter;