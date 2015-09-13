'use strict';

var through = require('through'),
    through2 = require('through2'),
    extend = require('node.extend'),
    exec = require('child_process').exec,
    path = require('path'),
    async = require('async'),
    File = require('vinyl');

module.exports = gitShow;

function gitShow(opts) {
  var files = [];

  opts = extend(getDefaultOpts(), opts);

  // return through(getFromGitShow);

  return through2.obj(bufferContents, endStream);



  function bufferContents(file, enc, cb) {
    files.push(file);
    cb();
  }

  function endStream(cb) {
    var self = this;
    console.log('end stream');
    async.map(files, gitShow, cb);

    // exec('git show :' + shortPath, function(err, stdout, stderr) {
    //   console.log('git show');
    //   file.contents = Buffer(stdout.toString());
    //   console.log(stdout);
    //   self.push(file);
    //   // vinyl.emit('data', file);
    //   cb();
    // });

    function gitShow(file, cb) {
      var relativePath = path.relative(opts.relativeTo, file.path);
      console.log('git show is called ' + relativePath);
      exec('git show :' + relativePath, function(err, stdout, stderr) {
        console.log('git show cb');
        console.log(stdout.toString());
        file.contents = Buffer(stdout.toString());
        self.push(file);
        cb();
      });
    }
  }

  /////////

  function getFromGitShow(file) {
    var shortPath = path.relative(opts.relativeTo, file.path),
        vinyl = this;

    exec('git show :' + shortPath, function(err, stdout, stderr) {
      console.log('git show');
      file.contents = Buffer(stdout.toString());
      console.log(stdout);
      // vinyl.push(file);
    });


  }
}

function getDefaultOpts() {
  return {
    staged: false,
    commit: 'head',
    passThroughUnfound: false,
    relativeTo: process.cwd()
  };
}