var concat = require('broccoli-concat');
var filterES6Modules = require('broccoli-es6-module-filter');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var concatFilenames = require('broccoli-concat-filenames');
var jshintTree = require('broccoli-jshint');
var browserify = require('broccoli-browserify');

function cjs() {
  return filterES6Modules('lib', {
    moduleType: 'cjs',
    anonymous: false,
    packageName: 'relativity',
    main: 'relativity',
    compatFix: true
  });
}

function plainCJS() {
  return concat(cjs(), {
    inputFiles: ['*.js'],
    outputFile: '/relativity.cjs.js'
  });
}

function browserified() {
  return browserify(cjs(), {
    require: [['./relativity', {expose: 'relativity'}]],
    outputFile: '/relativity.browserify.js'
  });
}

function makeTests() {
  // Create main.js which imports all tests
  var testsMain = concatFilenames("test/tests", {
    inputFiles: ["*_test.js"],
    outputFile: "/main.js",
    transform: function(fileName) {
      return "import './" + fileName  + "';";
    }
  });

  var tests = filterES6Modules(mergeTrees(['test/tests', testsMain]), {
    moduleType: 'cjs',
    compatFix: true,
    packageName: 'tests',
    anonymous: false
  });

  var tests = browserify(tests, {
    entries: ['./main.js'],
    outputFile: '/tests/tests.js',
    external: ['relativity']
  });

  // for use with qunit
  var html = pickFiles('test', {
    files:  ['index.html'],
    srcDir: '/',
    destDir: '/tests'
  });

  // QUnit itself
  var qunit = pickFiles('node_modules/qunitjs/qunit', {
    files:  ['qunit.js', 'qunit.css'],
    srcDir: '/',
    destDir: '/tests'
  });
   
  var loader = concat('vendor', {
    inputFiles: ['loader.js'],
    outputFile: '/tests/loader.js'
  });

  var hints = jshintTree(mergeTrees(['lib', 'test/tests']), {
    destFile: '/tests/hints.js'
  });
  
  return mergeTrees([qunit, html, tests, hints]);

}

module.exports = mergeTrees([plainCJS(), browserified(), makeTests()]);

