/**
 * Copyright (c) 2014, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

var path = require( 'path' );

function getPath( version ) {
	return path.resolve( '.bender/jqueryCache/jquery-' + version + '.min.js' );
}

module.exports = {
	name: 'bender-pagebuilder-jquery',

	attach: function() {
		var bender = this;

		function build( data ) {
			var version;

			// check if we really need to include jQuery
			if ( data.jquery ) {
				version = data.jquery;
			} else if ( data.tags && data.tags.some( function( tag ) {
				return tag.toLowerCase() === 'jquery';
			} ) ) {
				version = bender.conf.jQueryDefault;
			} else {
				return data;
			}

			// inject the script tag
			data.parts.push(
				'<head><script src="' +
				path.join( '/plugins/', getPath( version ) ).split( path.sep ).join( '/' ) +
				'"></script></head>'
			);

			// TODO move to bender's core?
			if ( data.ignoreOldIE ) {
				data.parts.push( [
					'<head><script>',
					'(function () {',
					'bender.ignoreOldIE = true;',
					'})();',
					'</script></head>'
				].join( '\n' ) );
			}

			return data;
		}

		module.exports.build = build;

		var priority = bender.pagebuilders.getPriority( 'html' );

		bender.pagebuilders.add( 'jquery', build, priority - 1 );
	}
};
