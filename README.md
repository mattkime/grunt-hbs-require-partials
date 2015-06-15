# grunt-hbs-require-partials
transforms compiled hbs templates to require necessary partials

uses standard grunt src-dest file mapping - http://gruntjs.com/configuring-tasks#files

##options

exclude - excludes specific partials from being required. function is given partial name as arg. return true to exclude a given partial.

partialToModule - function used to map partial names to module names
