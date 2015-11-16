var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function(){
  return gulp.src(['./app/**/*.js'])
    .pipe(jshint())
    .pipe(eslint.reporter('default'))
});

gulp.task('watch', function() {
  gulp.watch(['./app/**/*.js'], ['lint']);
});

gulp.task('default', ['watch', 'lint']);