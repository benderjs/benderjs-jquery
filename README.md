benderjs-jquery
===============

[jQuery](http://jquery.com) plugin for [Bender.js](https://github.com/benderjs/benderjs).

Creates tests for all versions of jQuery specified in `bender.js` configuration file.
Appropriate version of jQuery will be downloaded from [jQuery's CDN](http://code.jquery.com/jquery/), cached and included in the test context.

Installation
------------

```
npm install benderjs-jquery
```

Usage
-----

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

Specify jQuery versions for a test group:

```javascript
var config = {
    applications: {...}

    browsers: [...],

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
As a result 3 tests will be created:

- tests/tests?jquery=1.7.2
- tests/tests?jquery=1.10.2
- tests/tests?jquery=2.0.1


License
-------

MIT, for license details see: [LICENSE.md](https://github.com/benderjs/benderjs-jquery/blob/master/LICENSE.md).
