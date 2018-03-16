#!/usr/bin/env bash

mydir=$(dirname $0)

find /usr/share/gir-1.0 -name *.gir \
    | xargs -n1 -I % sh -c 'echo -n %; echo -n " "; echo -n "'$mydir'"/../../build/; echo -n $(basename % .gir); echo -n ".js"; echo' \
    | xargs -n2 "$mydir"/../../src/converter/convertGirToJs.js