var config;
var plugins;
var gulp;
var _;

function copyFontsTask() {
  return gulp.src([
      config.srcPath + '/bower_components/font-awesome/fonts/**'
    ])
    .pipe(gulp.dest(config.buildPath + '/fonts'));
}

module.exports = function(globalGulp, globalPlugins, globalConfig) {
  config = globalConfig;
  plugins = globalPlugins;
  gulp = globalGulp;
  _ = plugins._;

  gulp.task('copy:fonts', copyFontsTask);
}
