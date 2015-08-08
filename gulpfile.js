var gulp = require('gulp');
var concat = require('gulp-concat');
var jade = require('gulp-jade');

gulp.task('js', function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./public/javascripts'));
})

gulp.task('jade', function() {
  return gulp.src('views/*.jade')
    .pipe(jade({}))
    .pipe(gulp.dest('./public/views'));
})

gulp.task('default', function() {
  gulp.watch('./views/*.jade', ['jade']);
  gulp.watch('src/**/*.js', ['js']);
});
