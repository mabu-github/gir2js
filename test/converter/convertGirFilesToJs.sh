#!/usr/bin/env bash

mydir=$(dirname $0)

cat <(find /usr/share/gir-1.0 -name *.gir) <(find /usr/share/gnome-shell -name *.gir) \
    | xargs -n1 -I % sh -c 'echo -n "'$mydir'"/../../build/; echo -n " "; echo -n %; echo' \
    | xargs -n2 "$mydir"/../../src/converter/convertGirToJs.js