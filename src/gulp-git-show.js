'use strict';

var through = require('through'),
    through2 = require('through2'),
    extend = require('node.extend'),
    exec = require('child_process').exec,
    path = require('path'),
    async = require('async'),
    File = require('vinyl');

module.exports = getTransformStream;

////////////

function getTransformStream(opts) {
  var files = [];

  opts = extend(getDefaultOpts(), opts);

  return through2.obj(bufferContents, endStream);

  ///////////////

  function bufferContents(file, enc, cb) {
    files.push(file);
    cb();
  }

  function endStream(cb) {
    var self = this;
    async.map(files, gitShow, cb);

    /////////////

    function gitShow(file, cb) {
      var relativePath = path.relative(opts.relativeTo, file.path);
      exec(getExecString(relativePath), function(err, stdout, stderr) {
        file.contents = Buffer(stdout.toString());
        self.push(file);
        cb();
      });
    }
  }

  function getExecString(relativePath) {
    if (opts.staged) {
      return 'git show :' + relativePath;
    } else {
      return 'git show ' + opts.commit + ':' + relativePath;
    }
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