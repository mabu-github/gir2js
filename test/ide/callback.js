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
     * @param {boolean} param_bool doc1
     * @param {number} param_num doc2
     * @return {boolean}
     */
    /**
     * @type {callback_GtkAboutDialogClass}
     */
    this.activate_link = null;

    /**
     * @type {function(boolean, number): string}
     */
    this.fun = null;
};

let cgtk = new CGtk.AboutDialogClass();
// autocomplete a function here
cgtk.activate_link;
// autocomplete a function here
cgtk.fun;