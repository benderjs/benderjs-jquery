var path = require( 'path' ),
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

			if ( plugin.files ) {
				bender.plugins.addFiles( plugin.files );
			}
		} );
	}
};
