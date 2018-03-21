# TODOs

Process elements in namespace:
*** signals
**** a signal can probably do more than connect()
**** add signal method documentation (e.g. to all connect calls etc.)
* record
* alias
* class -> class fields
* interface

Handle basic types in getParameterType():
* is GStr also a normal string in javascript?
* take care of namespace: Gtk.Action instead of Action (all kind of types)
** return types
** parameter types
** property types
* is conversion valid? find example
** gpointer -> string (closest equivalent to byte data), or better ArrayBuffer?

Make ./test/converter/convertGirFilesToJs.sh work by fixing conversion script accordingly.

Improve seed runtime info file:
* [Seed runtime documentation](https://people.gnome.org/~racarr/seed/runtime.html)

Handle parent classes outside of own class namespace.

Documentation from GIR file needs to be processed to be valid in docblock. There are @ signs and some
  kind of links in it that need conversion.

Interfaces like Gtk.Orientable are missing.

Check for duplicated method names (method, virtual-method -> at least in interface a method may appear multiple times).

Do Interface parameters have to be added to a class constructor? If yes, implement.

Rename Namespace::init2() and init() -> initClassesByName(), initInterfacesByName()

Autocompletion for interfaces does not work (signals, properties, methods).
Need to mix the signals and properties of interfaces manually into the definition.