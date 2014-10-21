# benderjs-jquery

[jQuery](http://jquery.com) plugin for [Bender.js](https://github.com/benderjs/benderjs).

Creates tests for all versions of jQuery specified in `bender.js` configuration file.
Appropriate version of jQuery will be downloaded from [jQuery's CDN](http://code.jquery.com/jquery/), cached and included in the test context.

## Installation

```
npm install benderjs-jquery
```

## Usage

Add `benderjs-jquery` to the `plugins` array in your `bender.js` configuration file:

```javascript
var config = {
    applications: {...}

    browsers: [...],

    plugins: ['benderjs-jquery'], // load the plugin

    tests: {...}
};

module.exports = config;
```

Specify jQuery versions:

```javascript
var config = {
    applications: {...}

    browsers: [...],
    
    jQueryDefault: '2.0.0' // override the default jQuery version

    plugins: ['benderjs-jquery'],

    tests: {
        Foo: {
            basePath: '',
            jQuery: ['1.7.2', '1.10.2', '2.0.1'], //define jQuery versions
            paths: [...]
        }
    }
};

module.exports = config;
```

Add `jquery` to the test's tags:
```javascript
// sample test file: tests/test.js
/* bender-tags: foo, bar, jquery */

bender.test({...});
```

If the test's group definition contains jQuery versions specified, as a result 3 tests will be created:

- tests/tests?jquery=1.7.2
- tests/tests?jquery=1.10.2
- tests/tests?jquery=2.0.1

If there's no jQuery configuration for the test group, a default version of jQuery will be included in a test context.

## Configuration

You can configure some of the jQuery plugin options using `bender.js` configuration file.

### Available options

- *String* `jQueryDefault` - jQuery's default version to be loaded in a test context. Default: `1.11.1`

## License

MIT, for license details see: [LICENSE.md](https://github.com/benderjs/benderjs-jquery/blob/master/LICENSE.md).
