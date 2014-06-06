var _ = require( 'lodash' );

function build( data ) {
	var pattern = /(?:^|,)jquery(?:$|,)/i,
		versions = data.jquery;

	// no jQuery versions specified - abort
	if ( !versions ) {
		return data;
	}

	Object.keys( data.tests ).forEach( function( name ) {
		// no jquery tag - leave
		if ( !pattern.test( data.tests[ name ].tags.join( ',' ) ) ) {
			return;
		}

		// create separate tests for each jQuery version
		versions.forEach( function( version ) {
			var test = _.clone( data.tests[ name ] );

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
		this.testbuilders.push( build );
	}
};
