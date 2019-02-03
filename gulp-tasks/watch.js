var project = require('./_project.js');
var gulp    = require('gulp');


gulp.task('watch', function() {
  gulp.watch(
      project.buildSrc + '/assets/js/**/*',
      gulp.series('scripts')
  )
  gulp.watch(project.buildSrc + '/scss/**/*', gulp.series('styles'))
  gulp.watch(project.buildSrc + '/icons/**/*', gulp.parallel('icons'))
  gulp.watch(
      project.buildSrc + '/assets/site/**/*',
      gulp.series('generate')
  )
})
