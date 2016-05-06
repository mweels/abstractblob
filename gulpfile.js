var gulp = require('gulp');
var tslint = require('gulp-tslint');
var exec = require('child_process').exec;
var jasmine = require('gulp-jasmine');
var gulp = require('gulp-help')(gulp);
var tsconfig = require('gulp-tsconfig-files');
var path = require('path');
var inject = require('gulp-inject');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var dtsGenerator = require('dts-generator');
require('dotbin');
var ts = require('gulp-typescript');
var mocha = require("gulp-mocha");

var tsFilesGlob = (function (c) {
  return c.filesGlob || c.files || '**/*.ts';
})(require('./tsconfig.json'));

var appName = (function (p) {
  return p.name;
})(require('./package.json'));

gulp.task('update-tsconfig', 'Update files section in tsconfig.json', function () {
  gulp.src(tsFilesGlob).pipe(tsconfig());
});

gulp.task('clean', 'Cleans the generated js files from lib directory', function () {
  return del([
    'lib/**/*'
  ]);
});

gulp.task('tslint', 'Lints all TypeScript source files', function () {
  return gulp.src(tsFilesGlob)
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('gen-def', 'Generate a single .d.ts bundle containing external module declarations exported from TypeScript module files', function (cb) {
  return dtsGenerator.default({
    name: appName,
    project: '.',
    out: './lib/' + appName + '.d.ts',
    exclude: ['node_modules/**/*.d.ts', 'typings/**/*.d.ts']
  });
});

var serverTS = ["**/*.ts", "!node_modules/**", '!bin/**'];
gulp.task('_build', 'INTERNAL TASK - Compiles all TypeScript source files', function (cb) {
  return gulp
    .src(serverTS, { base: './' })
    .pipe(ts({ module: 'commonjs', noImplicitAny: true }))
    .pipe(gulp.dest('./lib/'));
});

//run tslint task, then run update-tsconfig and gen-def in parallel, then run _build
gulp.task('build', 'Compiles all TypeScript source files and updates module references', ['_build']);

gulp.task('test', 'Runs the Jasmine test specs', ['build'], function () {
  return gulp.src('test/*.js')
    .pipe(mocha());
});

gulp.task('watch', 'Watches ts source files and runs build on change', function () {
  gulp.watch('src/**/*.ts', ['build']);
});
