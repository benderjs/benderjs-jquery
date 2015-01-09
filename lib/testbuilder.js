/**
 * Copyright (c) 2014, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

var _ = require( 'lodash' );

function build( data ) {
	var pattern = /(?:^|,)jquery(?:$|,)/i,
		// accept both new and old properties
		versions = data.jQuery || data.jquery;

	// no jQuery versions specified - abort
	if ( !versions ) {
		return data;
	}

	Object.keys( data.tests ).forEach( function( name ) {
		// no jquery tag - leave
		if ( !data.tests[ name ].tags || !pattern.test( data.tests[ name ].tags.join( ',' ) ) ) {
			return;
		}

		// create separate tests for each jQuery version
		versions.forEach( function( version ) {
			var test = _.cloneDeep( data.tests[ name ] );

			test.jquery = version;

			if ( version.split( '.' )[ 0 ] !== '1' ) {
				test.ignoreOldIE = true;
			}

			data.tests[ name + '?jquery=' + version ] = test;
		} );

		delete data.tests[ name ];
	} );

	return data;
}

module.exports = {
	name: 'bender-testbuilder-jquery',

	attach: function() {
		this.testbuilders.add( 'jquery', build );
	}
};
