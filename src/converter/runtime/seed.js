exports.createSeedRuntimeInformation = function() {
    let seed = "";

    seed += "Seed = {};\n";
    seed += "Seed.print = function(string) {};\n";
    seed += "Seed.argv = [];\n";

    seed += "/** Native module imports, e.g. imports.readline */";
    seed += "var imports = {};\n";
    seed += "/** Import search path */";
    seed += "imports.searchPath = [];\n";
    seed += "/** GObject-Introspection imports, e.g. imports.gi.Gtk */";
    seed += "imports.gi = {};\n";
    seed += "/** Set import version to be required, e.g. imports.gi.versions.Gtk = '3.0' */";
    seed += "imports.gi.versions = {};\n";

    return seed;
};