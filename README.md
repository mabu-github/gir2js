# gir2js
Converts GIR 2 Javascript Code that can be used for autocompletion and documentation in IDEs

## Setup

```
npm install
```

## How to execute

```
./src/converter/convertGirToJs.js <path-to-gir-file> <path-to-js-output-file>
```

## How to find GIR files on your system

One possible location is `/usr/share/gir-1.0/`. Execute the following to find GIR files

```
find /usr/share -iname *.gir -type f
```