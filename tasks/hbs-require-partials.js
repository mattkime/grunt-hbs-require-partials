'use strict';

module.exports = function( grunt ) {
	var toPaths = function( arr ){
		return arr.map( function( fileObj ){ return fileObj.src[0] } );
	};

	grunt.registerMultiTask( 'hbs-require-partials', 'add partials to your define requirements', function() {
		var fs = require( 'fs' ),
			acorn = require( 'acorn' ),
			walk = require( 'acorn/dist/walk' ),
			escodegen = require( 'escodegen' ),
			excludeFn = this.options().exclude || function(){ return false; },
			partialToModule = this.options().partialToModule || function(item){ return item };

		var processHbsJs = function( filePath ){

			var partials = [],
			data = fs.readFileSync(filePath),
			tree = acorn.parse( data );

			walk.simple( tree, { "CallExpression" : function( a ){
				var partialName;

				if( ( a.callee.property && a.callee.property.name === "invokePartial" ) ){
					partialName = a.arguments[0].property.value;
					if(!excludeFn(partialName)){
						partials.push( partialName );
					}
				}
			}});

			if( partials.length > 0){
				grunt.log.writeln( filePath, "=>", JSON.stringify( partials ) );

				var pm = partials.map(function(item){
					return { type : "Literal", value : partialToModule(item) };
				});

				var codeToInsert = "var _partials = " + JSON.stringify(partials) + ";"
				codeToInsert += "var _partialFns = Array.prototype.slice.call( arguments, 1);"
				codeToInsert += "for (var _i = 0; _i < _partialFns.length; _i++) { Handlebars.registerPartial(_partials[_i],_partialFns[_i]);}";

				//inserts partials into define statement
				tree.body[0].expression.arguments[0].elements = tree.body[0].expression.arguments[0].elements.concat( pm );
				//inserts code that registers partials
				tree.body[0].expression.arguments[1].body.body = acorn.parse(codeToInsert).body.concat( tree.body[0].expression.arguments[1].body.body );

				fs.writeFileSync( filePath, escodegen.generate(tree) );
			}

		};

		toPaths( this.files ).forEach( function( file ){
			 processHbsJs( file )
		});

	});

};
