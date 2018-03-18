#!/usr/bin/env seed

(function() {
    function handleExceptions(property, hierarchy) {
        const prop = hierarchy + property;

        if (prop === "Seed.argv")
            return "Seed.argv = [];";

        if (prop === "user_paths")
            return "user_paths = [];";

        if (prop === "ARGV")
            return "ARGV = [];";
        
        if (prop === "imports") {
            let imports = "";
            imports += "/** Native module imports, e.g. imports.readline */\n";
            imports += "var imports = {};";
            imports += "/** Import search path */";
            imports += "imports.searchPath = [];";
            imports += "/** GObject-Introspection imports, e.g. imports.gi.Gtk */";
            imports += "imports.gi = {};";
            imports += "/** Set import version to be required, e.g. imports.gi.versions.Gtk = '3.0' */";
            imports += "imports.gi.versions = {};";
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

        Object.getOwnPropertyNames(object).forEach(function(prop) {
            const sub = eval(hierarchy + prop);
            if (handleExceptions(prop, hierarchy) !== "") {
                return;
            }

            if (sub !== undefined && sub.toString() === "[object Object]") {
                if (funCreateVar) {
                    funCreateVar(hierarchy + prop);
                }
            } else {
                funCreateProperties(prop, object, hierarchy);
            }

            if (sub !== undefined && sub.toString() === "[object Object]") {
                applyToProperties(sub, hierarchy + prop + ".", funCreateProperties);
            }
        });
    }

    if (Seed) {
        var console = {};
        console.log = function(arg) {
            print(arg);
        }
    }

    applyToProperties(this, "", function (property, ctx, hierarchy) {
        const prop = eval(hierarchy + property);

        let prefix = "";
        if (ctx.toString() === "[object GlobalObject]") {
            prefix = "";
        }

        const exception = handleExceptions(property, hierarchy);
        if (exception !== "") {
            console.log(exception);
            return;
        }

        if (prop === undefined) {
            console.log(hierarchy + property + " = undefined;");
        } else if (typeof(prop) === "function") {
            console.log(hierarchy + property + " = function () {};");
        } else if (Array.isArray(prop)) {
            console.log(hierarchy + property + " = [];");
        } else if (prop.toString() === "[object Object]") {
            console.log(hierarchy + property + " = {};");
        } else {
            console.log(hierarchy + property + " = null;")
        }
    }, function(property) {
        console.log("var " + property + " = {};");
    });
})();