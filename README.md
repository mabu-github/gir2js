# gir2js

Converts GIR 2 Javascript Code that can be used for autocompletion and documentation in IDEs.

Motivation: it is much easier to develop when autocompletion can be provided where possible.

## Setup

```
npm install
```

## How to execute

```
./src/converter/convertGirToJs.js <path-to-js-output-directory> <path-to-gir-file>...
```

## How to find GIR files on your system

One possible location is `/usr/share/gir-1.0/`. Execute the following to find GIR files

```
find /usr/share -iname *.gir -type f
```

## Helpful manuals that help in development

GIR Schema
* [GIR Reference](https://github.com/GNOME/gobject-introspection/blob/master/docs/reference/gi-gir-reference.xml)
* [GIR Schema](https://github.com/shana/bindinator/blob/master/scheme/gir.xsd)

JS-DOC Typehints:
* [Webstorm Type Validation](https://blog.jetbrains.com/webstorm/2012/10/validating-javascript-code-with-jsdoc-types-annotations/)
* [Closure Compiler JS Annotations](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler)
* [JS Doc](http://usejsdoc.org/index.html)
* [Article about Typehinting in JS](https://strongloop.com/strongblog/type-hinting-in-javascript/)

Seed:
* [Seed runtime documentation](https://people.gnome.org/~racarr/seed/runtime.html)
* [Seed Examples](https://github.com/GNOME/seed-examples)

Glib Basic Types:
* [Glib Basic Types](https://developer.gnome.org/glib/stable/glib-Basic-Types.html)