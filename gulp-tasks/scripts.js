var project = require('./_project.js');
var gulp    = require('gulp');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var pump    = require('pump');



// Uglify our javascript files into one.
// Use pump to expose errors more usefully.
gulp.task('scripts', function(done) {
  pump([
      gulp.src(project.buildSrc + "/assets/js/**/*.js"),
      concat('app.js'),
      uglify(),
      gulp.dest(project.buildDest + '/assets/js')
    ],
    done()
  );
});

