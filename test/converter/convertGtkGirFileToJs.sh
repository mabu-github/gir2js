#!/usr/bin/env bash

mydir=$(dirname $0)
"$mydir"/../../src/converter/convertGirToJs.js "$mydir"/../../build/ /usr/share/gir-1.0/Gtk-3.0.gir