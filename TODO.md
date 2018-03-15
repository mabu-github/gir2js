# TODOs

Process elements in namespace:
* alias
* bitfield
* callback
* class
** constructor
*** does a parent constructor have to be handled when none is given? Currently parameterless default constructor is assumed.
*** handle multiple constructors: use @signature annotation + describe parameter better than arg0, arg1, e.g. use name
*** handle multiple constructors: process documentation per constructor and merge it with the classes docblock
    let documentation = "";
    if (clazz.constructor.length === 2) {
        documentation = processDocumentation(clazz.constructor[1])
    }
*** constructor parameters
**** handle parameter types that are not utf8->string or class
** fields
** signals
** implements
** methods
** properties
** virtual methods
* constant
* enumeration
* function
* interface
* record

Check against schema elements:
* [GIR Reference](https://github.com/GNOME/gobject-introspection/blob/master/docs/reference/gi-gir-reference.xml)
* [GIR Schema](https://github.com/shana/bindinator/blob/master/scheme/gir.xsd)

Add js-doc type hints:
* [Webstorm Type Validation](https://blog.jetbrains.com/webstorm/2012/10/validating-javascript-code-with-jsdoc-types-annotations/)
* [Closure Compiler JS Annotations](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler)
* [JS Doc](http://usejsdoc.org/index.html)
* [Article about Typehinting in JS](https://strongloop.com/strongblog/type-hinting-in-javascript/)

Try to find out how mapping works by using seed:
* [Seed Examples](https://github.com/GNOME/seed-examples)

Handle basic types in getParameterType():
* [Glib Basic Types](https://developer.gnome.org/glib/stable/glib-Basic-Types.html)