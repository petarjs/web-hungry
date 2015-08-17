var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');

// all npm packages will be available in plugins variable
var plugins = gulpLoadPlugins({
 rename: {
  'gulp-util': 'gutil'
 }
});

// add non-gulp plugins
plugins.path = require('path');
plugins.del = require('del');
plugins.merge = require('merge-stream');
plugins.stylish = require('jshint-stylish');
plugins.es = require('event-stream');
plugins.fs = require('fs');
plugins._ = require('lodash');
plugins.series = require('stream-series');
plugins.runSequence = require('run-sequence');

var version = JSON.parse(plugins.fs.readFileSync('./package.json', 'utf8')).version;

var config = {
 srcPath: 'resources',
 buildPath: 'public',
 version: version,
 vendorFilename: './vendor.json'
};

// load tasks
var versionTask = require('./gulp-tasks/version')(gulp, plugins, config);
var cleanTask = require('./gulp-tasks/clean')(gulp, plugins, config);
var copyTask = require('./gulp-tasks/copy')(gulp, plugins, config);
var scriptsTask = require('./gulp-tasks/scripts')(gulp, plugins, config);
var cssTask = require('./gulp-tasks/css')(gulp, plugins, config);
var fontsTask = require('./gulp-tasks/fonts')(gulp, plugins, config);
var imagesTask = require('./gulp-tasks/images')(gulp, plugins, config);
var watchTask = require('./gulp-tasks/watch')(gulp, plugins, config);

// main tasks
gulp.task('default', function() {
 plugins.runSequence(
   ['clean'],
   ['scripts', 'css', 'fonts', 'images'],
   ['watch']
 );
});

gulp.task('build', function() {
 plugins.runSequence(
   ['clean'],
   ['scripts', 'css', 'fonts', 'images']
 );
});
