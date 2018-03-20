# TODOs

Process elements in namespace:
* alias
* (/) bitfield
* callback
* class
** (/) constructor
*** does a parent constructor have to be handled when none is given? Currently parameterless default constructor is assumed.
*** (/) handle multiple constructors: use @signature annotation + describe parameter better than arg0, arg1, e.g. use name
*** (/) handle multiple constructors: process documentation per constructor and merge it with the classes docblock
    let documentation = "";
    if (clazz.constructor.length === 2) {
        documentation = processDocumentation(clazz.constructor[1])
    }
*** (/) constructor parameters
**** (/) handle parameter types that are not utf8->string or class
*** (/) handle constructor parameters parameter object, e.g. new Gtk.Window.(^{^ type: Gtk.WindowType.TOPLEVEL });
*** (/) constructor parameter object properties are not taken from signature but from object properties
*** (/) add constructor parameter object properties from parents
*** (/) class methods
**** (/) class method parameter documentation
**** (/) class method return type
*** (/) class functions
*** (/) class signals
**** a signal can probably do more than connect()
**** add signal method documentation (e.g. to all connect calls etc.)
**** autocompletion for signals does not work
*** (/) class properties
*** class fields
*** class virtual-methods
*** implements
** (/) methods
** (/) properties
*** autocompletion for properties with - sign does not work
*** (/) property type hint
** virtual methods
* (/) constant
** (/) respect constant type
* (/) enumeration
* (/) function
* interface
* record
* (/) handle parent type

Try to find out how mapping works by using seed:
* [Seed Examples](https://github.com/GNOME/seed-examples)

Handle basic types in getParameterType():
* is GStr also a normal string in javascript?
* take care of namespace: Gtk.Action instead of Action (all kind of types)
** return types
** parameter types
** property types
* is conversion valid? find example
** gpointer -> string (closest equivalent to byte data), or better ArrayBuffer?

Make ./test/converter/convertGirFilesToJs.sh work by fixing conversion script accordingly.

Why is there an empty docblock in Gtk.WindowAccessible.c_new()?

Improve seed runtime info file:
* [Seed runtime documentation](https://people.gnome.org/~racarr/seed/runtime.html)

Handle parent classes outside of own class namespace.

Structure:
* conversion/ should only write code and use the structures in gir/

Do not use renderFile directly. Use methods in Template.js

Docblock formatting when doc and/or signature missing. When both missing, omit block.

Use ES6 class notation throughout the project.