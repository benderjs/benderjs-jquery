/**
 * Copyright (c) 2014, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

var request = require( 'request' ),
	path = require( 'path' ),
	fs = require( 'fs' );

module.exports = {
	name: 'bender-jquery',

	attach: function() {
		var bender = this;

		fs.readdirSync( __dirname ).forEach( function( file ) {
			var plugin;

			if ( file === 'index.js' ) {
				return;
			}

			plugin = require( path.join( __dirname, file ) );

			bender.use( plugin );
		} );
	},

	init: function( done ) {
		var bender = this,
			host = 'http://code.jquery.com/',
			cache = path.resolve( '.bender/jqueryCache/' ),
			logger = bender.logger.create( 'jquery', true ),
			oldApi = false,
			versions = [],
			files = [];

		// collect all versions of jQuery needed
		Object.keys( bender.conf.tests ).forEach( function( name ) {
			var group = bender.conf.tests[ name ],
				jQuery = group.jQuery || group.jquery;

			if ( Array.isArray( jQuery ) ) {
				jQuery.forEach( function( version ) {
					if ( versions.indexOf( version ) === -1 ) {
						versions.push( version );
					}
				} );
			}

			// old property was used
			if ( group.jquery ) {
				oldApi = true;
			}
		} );

		// the configuration uses old property, notify about deprecation
		if ( oldApi ) {
			logger.warn( 'group.jquery property is outdated - please use group.jQuery instead.' );
		}

		// add default jQuery version
		bender.conf.jQueryDefault = bender.conf.jQueryDefault || '1.11.1';

		if ( versions.indexOf( bender.conf.jQueryDefault ) === -1 ) {
			versions.push( bender.conf.jQueryDefault );
		}

		// build a list of jQuery files
		versions.forEach( function( version ) {
			files.push( 'jquery-' + version + '.js' );
			files.push( 'jquery-' + version + '.min.js' );
			// fix for invalid source map definition in jQuery 2.0.0
			files.push( version === '2.0.0' ? 'jquery.min.map' : 'jquery-' + version + '.min.map' );
		} );

		// make cached files accessible
		bender.plugins.addFiles( files.map( function( file ) {
			return path.join( cache, file );
		} ) );

		// check available library versions and download missing ones from jQuery's CDN
		function checkAvailable() {
			fs.readdir( cache, function( err, found ) {
				if ( err ) {
					logger.error( err );
					process.exit( 1 );
				}

				// check which files we need to download
				files = files.filter( function( file ) {
					return found.indexOf( file ) === -1;
				} );

				// download and save a file in the cache directory
				function next() {
					var name = files.shift();

					if ( !name ) {
						return done();
					}

					request( host + name )
						.on( 'error', function( err ) {
							logger.error( 'Error while downloading', name );
							logger.error( err );
							process.exit( 1 );
						} )
						.pipe( fs.createWriteStream( path.join( cache, name ) ) )
						.on( 'error', function( err ) {
							logger.error( 'Error while saving', name );
							logger.error( err );
							process.exit( 1 );
						} )
						.on( 'finish', function() {
							logger.info( 'Downloaded', name );
							next();
						} );
				}

				next();
			} );
		}

		// check if the cache directory exists
		fs.exists( cache, function( exists ) {
			if ( !exists ) {
				fs.mkdir( cache, function( err ) {
					if ( err ) {
						logger.error( err );
						process.exit( 1 );
					}

					checkAvailable();
				} );
			} else {
				checkAvailable();
			}
		} );
	}
};
