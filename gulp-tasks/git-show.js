'use strict';

var gulp = require('gulp'),
    config = require('./config.json'),
    gitShow = require('../src/gulp-git-show.js'),
    path = require('path');

gulp.task('git-show', function() {
  return gulp
    .src(config.selectors.srcScripts)
    .pipe(gitShow({
      staged: true
    }))
    .pipe(gulp.dest(path.join(process.cwd(),'build')));
});