# TODOs

Process elements in namespace:
* alias

Handle basic types in getParameterType():
* is GStr also a normal string in javascript?
* is conversion valid? find example
** gpointer -> string (closest equivalent to byte data), or better ArrayBuffer?

Make ./test/converter/convertGirFilesToJs.sh work by fixing conversion script accordingly.

Improve seed runtime info file:
* [Seed runtime documentation](https://people.gnome.org/~racarr/seed/runtime.html)

Handle parent classes outside of own class namespace (e.g. for getting all constructor parameters).

Documentation from GIR file needs to be processed to be valid in docblock.
* # links to foreign namespace
* #, ## heading -> markdown ===, ---

Check for duplicated method names (method, virtual-method -> at least in interface a method may appear multiple times).

Do Interface parameters have to be added to a class constructor? If yes, implement.

Autocompletion for interfaces does not work (signals, properties, methods).
Need to mix the signals and properties of interfaces manually into the definition.

Add python as a language conversion target.
* getParameterType does not separate between data structure and target language. It returns javascript specific return types.

Cleanup handling of callbacks in fields;