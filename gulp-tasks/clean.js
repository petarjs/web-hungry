var config;
var plugins;
var gulp;

function cleanScriptsTask () {
  return plugins.del.sync([
    config.buildPath + '/js/**',
  ]);
}

function cleanScriptsAppTask () {
  return plugins.del.sync([
    config.buildPath + '/js/app.js',
  ]);
}

function cleanScriptsVendorsTask () {
  return plugins.del.sync([
    config.buildPath + '/js/vendors.js',
  ]);
}

function cleanScriptsPartialsTask () {
  return plugins.del.sync([
    config.buildPath + '/js/partials.js',
  ]);
}

function cleanCssTask () {
  return plugins.del.sync([
    config.buildPath + '/css/**',
  ]);
}

function cleanCssAppTask () {
  return plugins.del.sync([
    config.buildPath + '/css/app.css',
  ]);
}

function cleanCssVendorsTask () {
  return plugins.del.sync([
    config.buildPath + '/css/vendors.css',
  ]);
}

function cleanFontsTask () {
  return plugins.del.sync([
    config.buildPath + '/fonts/*',
  ]);
}

module.exports = function(globalGulp, globalPlugins, globalConfig) {
  config = globalConfig;
  plugins = globalPlugins;
  gulp = globalGulp;

  gulp.task('clean:scripts', cleanScriptsTask);
  gulp.task('clean:scripts:app', cleanScriptsAppTask);
  gulp.task('clean:scripts:partials', cleanScriptsPartialsTask);
  gulp.task('clean:scripts:vendors', cleanScriptsVendorsTask);

  gulp.task('clean:css', cleanCssTask);
  gulp.task('clean:css:app', cleanCssAppTask);
  gulp.task('clean:css:vendors', cleanCssVendorsTask);

  gulp.task('clean:fonts', cleanFontsTask);

  gulp.task('clean', ['clean:scripts', 'clean:css']);
}
