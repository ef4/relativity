var concat = require('broccoli-concat');
var filterES6Modules = require('broccoli-es6-module-filter');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var concatFilenames = require('broccoli-concat-filenames');

function createAMDTree() {
  var amd = filterES6Modules('lib', {
    moduleType: 'amd',
    anonymous: false,
    packageName: 'relativity',
    main: 'relativity'
  });
  amd = concat(amd, {
    inputFiles: ['*.js'],
    outputFile: '/relativity.amd.js'
  });
  return amd;
}

function makeTests() {
  var tests = filterES6Modules('test/tests', {
    moduleType: 'amd',
    packageName: 'tests',
    anonymous: false
  });
  tests = concat(tests, {
    inputFiles: ['**/*.js'],
    outputFile: '/tests/tests.js'
  });

  // Create /tests/tests_main.js which requires all tests (all test/tests/**/*_test.js files)
  var testsMain = concatFilenames("test", {
    inputFiles: ["**/*_test.js"],
    outputFile: "/tests/tests_main.js",
    transform: function(fileName) {
      return "require('" + fileName  + "');";
    }
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

  // Merge all test related stuff into tests tree
  return mergeTrees([qunit, html, loader, tests, testsMain]);

}

module.exports = mergeTrees([createAMDTree(), makeTests()]);

