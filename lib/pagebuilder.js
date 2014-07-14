/**
 * Copyright (c) 2014, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

var path = require( 'path' );

function getPath( version ) {
	return path.resolve( '.bender/jqueryCache/jquery-' + version + '.min.js' );
}

function build( data ) {
	var version = data.jquery || '1.7.2';

	data.parts.push(
		'<head><script src="' +
		path.join( '/plugins/', getPath( version ) ).split( path.sep ).join( '/' ) +
		'"></script></head>'
	);

	// TODO move to bender's core?
	if ( data.ignoreOldIE ) {
		data.parts.push(
			'<head><script>\n' +
			'(function () {\n' +
			'bender.ignoreOldIE = true;\n' +
			'})();\n' +
			'</script></head>'
		);
	}

	return data;
}

module.exports = {
	name: 'bender-pagebuilder-jquery',

	build: build,

	attach: function() {
		var bender = this,
			html = bender.plugins[ 'bender-pagebuilder-html' ],
			idx;

		// add plugin before pagebuilder-html
		if ( html && ( idx = bender.pagebuilders.indexOf( html.build ) ) > -1 ) {
			bender.pagebuilders.splice( idx, 0, build );
		} else {
			bender.pagebuilders.push( build );
		}
	}
};
