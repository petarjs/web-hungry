var config;
var plugins;
var gulp;
var _;

function watchStylesTask() {
  gulp.watch([config.srcPath + '/assets/less/*.less'], function() {
    plugins.runSequence(
      'clean:css:app',
      'css:app'
    );
  });
}

function watchScriptsTask() {
  gulp.watch([config.srcPath + '/assets/scripts/**/*.js'], function() {
    plugins.runSequence(
      'clean:scripts:app',
      'scripts:app'
    );
  });
}

function watchTemplatesTask() {
  gulp.watch([config.srcPath + '/assets/**/*.html'], function() {
    plugins.runSequence(
      'clean:scripts:partials',
      'scripts:partials'
    );
  });
}

function watchVendorTask() {
  gulp.watch(config.vendorFilename, ['build']);
}


module.exports = function(globalGulp, globalPlugins, globalConfig) {
  config = globalConfig;
  plugins = globalPlugins;
  gulp = globalGulp;
  _ = plugins._;

  gulp.task('watch:styles', watchStylesTask);
  gulp.task('watch:scripts', watchScriptsTask);
  gulp.task('watch:templates', watchTemplatesTask);
  gulp.task('watch:vendor', watchVendorTask);
  gulp.task('watch', ['watch:styles', 'watch:scripts', 'watch:templates', 'watch:vendor']);

}
