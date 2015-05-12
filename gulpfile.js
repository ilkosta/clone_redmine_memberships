var gulp = require('gulp');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var rename = require("gulp-rename");
// var debug = require('gulp-debug');

var es6Paths = ['./src/*.es','./src/*/*.es'];
var testsPaths = ['./test/*.es'];

gulp.task('es6', function () {

    return gulp.src(es6Paths)
//         .pipe(debug({title: 'unicorn:', minimal: false}))
        .pipe(jshint({esnext: true}))
        .pipe(jshint.reporter(require('jshint-stylish')))
//         .pipe(jshint.reporter('fail'))
        .pipe(babel())
        .pipe(rename(function(path) { path.extname = '.js'; }))
        .pipe(gulp.dest('./lib'));
});


gulp.task('test', function () {
  return gulp.src(testsPaths, {base: './'})
    .pipe(jshint({esnext: true}))
    .pipe(jshint.reporter(require('jshint-stylish')))
    .pipe(babel())
    .pipe(rename(function(path) { path.extname = '.js'; }))
    .pipe(gulp.dest('./'));
});



gulp.task('watch', function() {
  gulp.watch(es6Paths, ['es6']);
  gulp.watch(testsPaths, ['test']);
});




gulp.task('default', ['es6', 'test','watch']);
