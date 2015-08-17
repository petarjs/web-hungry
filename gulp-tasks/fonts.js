var config;
var plugins;
var gulp;
var _;

function fontsTask() {
  return plugins.runSequence(
    ['clean:fonts'],
    ['copy:fonts']
  );
}

module.exports = function(globalGulp, globalPlugins, globalConfig) {
  config = globalConfig;
  plugins = globalPlugins;
  gulp = globalGulp;
  _ = plugins._;

  gulp.task('fonts', fontsTask);

}
