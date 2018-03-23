#!/usr/bin/env seed

(function() {
    function handleExceptions(property, hierarchy) {
        const prop = hierarchy + property;

        if ([
                "module_path",
                "Infinity",
                "NaN",
                "user_paths",
                "undefined",
                "i",
                "isNaN",
                "isFinite",
                "escape",
                "unescape",
                "decodeURI",
                "decodeURIComponent",
                "encodeURI",
                "encodeURIComponent",
                "EvalError",
                "ReferenceError",
                "SyntaxError",
                "URIError",
                "Proxy",
                "JSON",
                "Math",
                "Atomics",
                "console",
                "Int8Array",
                "Int16Array",
                "Int32Array",
                "Uint8Array",
                "Uint8ClampedArray",
                "Uint16Array",
                "Uint32Array",
                "Float32Array",
                "Float64Array",
                "DataView",
                "Date",
                "Boolean",
                "Number",
                "WeakMap",
                "WeakSet",
                "parseInt",
                "parseFloat",
                "Object",
                "Function",
                "Array",
                "RegExp",
                "RangeError",
                "TypeError",
                "ArrayBuffer",
                "String",
                "Symbol",
                "Error",
                "Map",
                "Set",
                "Promise",
                "eval",
                "Intl",
                "Reflect",
                "WebAssembly",
                "window",
                "ARGV",
                "GType"
            ].includes(hierarchy + property))
            return "\n";

        if (prop === "Seed.argv")
            return "Seed.argv = [];";

        if (prop === "user_paths")
            return "user_paths = [];";

        if (prop === "ARGV")
            return "ARGV = [];";
        
        if (prop === "imports") {
            let imports = "";
            imports += "/** Native module imports, e.g. imports.readline */\n";
            imports += "var imports = {};\n";
            imports += "/** Import search path */\n";
            imports += "imports.searchPath = [];\n";
            imports += "/** GObject-Introspection imports, e.g. imports.gi.Gtk */\n";
            imports += "imports.gi = {};\n";
            imports += "/** Set import version to be required, e.g. imports.gi.versions.Gtk = '3.0' */\n";
            imports += "imports.gi.versions = {};\n";
            return imports;
        }

        return "";
    }

    function applyToProperties(object, hierarchy="", funCreateProperties, funCreateVar) {
        if (funCreateVar && hierarchy !== "") {
            let createVar = "";
            if (hierarchy.endsWith(".")) {
                createVar += hierarchy.substring(0, hierarchy.length - 1);
            } else {
                createVar += hierarchy;
            }
            funCreateVar(createVar);
            funCreateVar = undefined;
        }

        Object.getOwnPropertyNames(object).forEach(prop => {
            const sub = eval(hierarchy + prop);
            const exceptions = handleExceptions(prop, hierarchy);

            if (exceptions === ""
                && sub !== undefined
                && sub.toString() === "[object Object]"
                && funCreateVar) {
                funCreateVar(hierarchy + prop);
            }
            funCreateProperties(prop, object, hierarchy);

            if (exceptions === "" && sub !== undefined && sub.toString() === "[object Object]") {
                applyToProperties(sub, hierarchy + prop + ".", funCreateProperties);
            }
        });
    }

    applyToProperties(this, "", function (property, ctx, hierarchy) {
        const prop = eval(hierarchy + property);

        const exception = handleExceptions(property, hierarchy);
        if (exception !== "") {
            print(exception);
            return;
        }

        if (prop === undefined) {
            print(hierarchy + property + " = undefined;");
        } else if (typeof(prop) === "function") {
            print(hierarchy + property + " = function () {};");
        } else if (Array.isArray(prop)) {
            print(hierarchy + property + " = [];");
        } else if (prop.toString() === "[object Object]") {
            print(hierarchy + property + " = {};");
        } else {
            print(hierarchy + property + " = null;")
        }
    }, function(property) {
        print("var " + property + ";");
    });
})();