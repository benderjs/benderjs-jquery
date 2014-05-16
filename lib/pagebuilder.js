var path = require('path'),
    versions = [
        '1.7', '1.7.1', '1.7.2', '1.8.3', '1.9.1', '1.10.1', '1.11.0',
        '2.0.0', '2.0.2', '2.1.0'
    ];

function getPath(ver) {
    return path.resolve(__dirname, '../vendor/jquery-' + ver + '.js');
}

function build(data) {
    var version = data.jquery || '1.7.2';

    data.parts.push(
        '<head><script src="' +
        path.join('/plugins/', getPath(version)).split(path.sep).join('/') +
        '"></script></head>'
    );

    return data;
}

module.exports = {
    name : 'bender-pagebuilder-jquery',
    
    files: versions.map(getPath),

    build: build,

    attach: function () {
        var bender = this,
            html = bender.plugins['bender-pagebuilder-html'],
            idx;

        // add plugin before pagebuilder-html
        if (html && (idx = bender.pagebuilders.indexOf(html.build)) > -1) {
            bender.pagebuilders.splice(idx, 0, build);
        } else {
            bender.pagebuilders.push(build);
        }
    }
};
