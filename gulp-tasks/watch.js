var project = require('./_project.js');
var gulp    = require('gulp');


/*
  Watch folders for changess
*/
gulp.task("watch", function () {
  gulp.watch(project.buildSrc + "/assets/js/**/*", gulp.parallel('scripts'));
  gulp.watch(project.buildSrc + "/assets/scss/**/*", gulp.parallel('styles'));
  gulp.watch(project.buildSrc + "/assets/site/**/*",  gulp.parallel('generate'));
});
