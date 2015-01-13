/* jshint node: true */
var concat = require('broccoli-sourcemap-concat');
var ES6Compiler = require('broccoli-es6modules');
var Funnel = require('broccoli-funnel');
var merge = require('broccoli-merge-trees');

var lib = concat(new Funnel(new ES6Compiler('lib'), {destDir: 'lib'}), {
  inputFiles: ["lib/*.js"],
  outputFile: 'relativity.js'
});


var testJS = concat(merge([
  new ES6Compiler(new Funnel('test', {destDir: 'test', include: [/\.js$/]})),
  new Funnel('vendor', {destDir: 'vendor'}),
  new Funnel('node_modules/mocha', {destDir: 'mocha'}),
  new Funnel('node_modules/chai', {destDir: 'chai'})
]), {
  headerFiles: ['vendor/loader.js', 'mocha/mocha.js', 'chai/chai.js'],
  inputFiles: ['test/*.js'],
  outputFile: 'tests.js'
});

var testPublic = merge([
  new Funnel('node_modules/mocha', { include: [/mocha\.css$/] }),
  new Funnel('test', { include: [/index\.html/] })
]);

module.exports = merge([lib, testJS, testPublic]);
