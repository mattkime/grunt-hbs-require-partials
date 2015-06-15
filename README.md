# grunt-hbs-require-partials
transforms compiled hbs templates to require necessary partials.

note: this code is extremely dependent upon the structure of compiled hbs javascript. This has been tested with hbs v2 but might not work with other versions.

uses standard grunt src-dest file mapping - http://gruntjs.com/configuring-tasks#files

##options

exclude - excludes specific partials from being required. function is given partial name as arg. return true to exclude a given partial.

partialToModule - function used to map partial names to module names
