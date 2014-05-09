var path = require('path'),
    versions = [
        '1.7', '1.7.1', '1.7.2', '1.8.3', '1.9.1', '1.10.1', '1.11.0',
        '2.0.0', '2.0.2', '2.1.0'
    ];

function getPath(ver) {
    return path.resolve(__dirname, '../vendor/jquery-' + ver + '.js');
}

module.exports = {
    name : 'bender-pagebuilder-jquery',
    
    files: versions.map(getPath),

    build: null,

    attach: function () {
        var bender = this;

        function build(data) {
            var version = data.jquery || '1.7.2';

            data.parts.push('<head><script src="/plugins' + getPath(version) + '"></script></head>');

            return data;
        }

        module.exports.build = build;
        bender.pagebuilders.push(build);
    }
};
