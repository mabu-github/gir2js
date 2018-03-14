#!/usr/bin/env bash

mydir=$(dirname $0)
"$mydir"/../../src/converter/convertGirToJs.js /usr/share/gir-1.0/Gtk-3.0.gir "$mydir"/../../build/Gtk-3.0.js