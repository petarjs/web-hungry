var config;
var plugins;
var gulp;

function imagesTask () {
  return gulp.src([config.srcPath + '/assets/images/**'])
          .pipe(gulp.dest(config.buildPath + '/images'));
}

function imagesDropzoneTask() {
  return gulp.src([config.srcPath + '/bower_components/dropzone/downloads/images/**'])
            .pipe(gulp.dest(config.buildPath + '/images'));
}

module.exports = function(globalGulp, globalPlugins, globalConfig) {
  config = globalConfig;
  plugins = globalPlugins;
  gulp = globalGulp;

  gulp.task('images:assets', imagesTask);
  gulp.task('images:dropzone', imagesDropzoneTask);
  gulp.task('images', ['images:assets', 'images:dropzone']);
}
