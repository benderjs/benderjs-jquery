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
			versions = [];

		// collect all versions of jQuery needed
		Object.keys( bender.conf.tests ).forEach( function( name ) {
			var group = bender.conf.tests[ name ];

			if ( Array.isArray( group.jquery ) ) {
				group.jquery.forEach( function( version ) {
					if ( versions.indexOf( version ) === -1 ) {
						versions.push( version );
					}
				} );
			}
		} );

		// make cached files accessible
		bender.plugins.addFiles( versions.map( function( version ) {
			return path.join( cache, 'jquery-' + version + '.min.js' );
		} ) );

		// check available library versions and download missing ones from jQuery's CDN
		function checkAvailable() {
			fs.readdir( cache, function( err, files ) {
				if ( err ) {
					logger.error( err );
					process.exit( 1 );
				}

				// check which versions we need to download
				versions = versions.filter( function( version ) {
					return files.indexOf( 'jquery-' + version + '.min.js' ) === -1;
				} );

				// download and save jQuery in the cache directory
				function next() {
					var version = versions.shift(),
						name;

					if ( !version ) {
						return done();
					}

					name = 'jquery-' + version + '.min.js';

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
