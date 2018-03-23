# TODOs

Process elements in namespace:
*** signals
**** a signal can probably do more than connect()
**** add signal method documentation (e.g. to all connect calls etc.)
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

Autocompletion for signals does not work for inherited classes and mixins (gi interfaces). Implement as shown
in test/ide/mixin.js to provide autocompletion.

Handle parameter type callback. Callback needs to be in a docblock before usage and the name must not contain '.':
---snip
var CGtk = {};
/**
 * @constructor
 */
CGtk.AboutDialogClass = function() {
    /**
     * @type {Gtk.DialogClass}
     */
    this.parent_class = null;
    /**
     * @callback callback_GtkAboutDialogClass
     * @param {boolean} param_bool
     * @param {number} param_num
     * @return {boolean}
     */
    /*
     * @type {callback_GtkAboutDialogClass}
     */
    this.activate_link = null;

};

let cgtk = new CGtk.AboutDialogClass();
cgtk.activate_link;
---/snip

Add python as a language conversion target.
* getParameterType does not separate between data structure and target language. It returns javascript specific return types.

Cleanup handling of callbacks in fields;

Callbacks in namespace must not contain ".";