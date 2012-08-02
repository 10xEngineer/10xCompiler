var fs = require('fs');
var path = require('path');
var util = require('util');
var os = require('os');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var async = require('async');

var CoreCompiler = require('./core').Compiler;
var fsHelper = require('../fsHelper');

function JavaCompiler(options) {
  CoreCompiler.call(this, options);
}

util.inherits(JavaCompiler, CoreCompiler);

JavaCompiler.prototype.prepare = function() {
  var self = this;

  // Assign a random id
  this.id = Math.random().toString(36).substr(2);

  // TODO: Determine and set absolute paths for compilers, ant etc.

  // TODO: tmpDir is not available for node 0.6.x
  var tmpDir = os.tmpDir ? os.tmpDir() : '/tmp';
  this.workspace = path.join(tmpDir, this.id);
  async.waterfall([
  
    // Create a temporary workspace in /tmp
    function(next) {
      // TODO: Asyncify
      fs.mkdirSync(self.workspace);
      fs.mkdirSync(path.join(self.workspace, 'src'));
      fs.mkdirSync(path.join(self.workspace, 'test'));
      fs.mkdirSync(path.join(self.workspace, 'lib'));
      next();
    },

    // TODO: Get the source code from specified vfs to workspace/src
    function(next) {
      var vfs = self.options.vfs;
      fsHelper.copyFromVfs({
        vfs: vfs,
        dest: path.join(self.workspace, 'src')
      }, next);
    },

    // TODO: Copy required resources to workspace
    function(next) {
      fsHelper.copyResources({
        workspace: self.workspace,
        language: self.options.language,
        version: self.options.version
      }, next);
    }
  ],function(error) {
    self.emit('status', 'prepared');
    self.emit('done');    
  });
};

JavaCompiler.prototype.clean = function() {
  var self = this;
  var options = {
    cwd: this.workspace
  };

  exec('ant clean', options, function(error, stdout, stderr) {
    if(error) {
      return self.emit('error', error);
    }

    if(stderr) {
      console.log(error);
      self.emit('error', new Error(error));
    } else {
      self.emit('status', 'prepared');
      self.emit('cleaned');
    }
  });
};

JavaCompiler.prototype.compile = function() {
  var self = this;
  var options = {
    cwd: this.workspace
  };

  self.emit('status', 'compiling');
  exec('ant compile', options, function(error, stdout, stderr) {
    if(error) {
      return self.emit('error', error);
    }

    if(stderr) {
      console.log(error);
      self.emit('status', 'dirty');
      self.emit('error', new Error(error));
    } else {
      self.emit('status', 'compiled');
      self.emit('compiled');
    }
  });
};

JavaCompiler.prototype.run = function() {
  var self = this;
  var options = {
    cwd: this.workspace,
    //maxBuffer: 2000*1024,
    timeout: 5000
  };

  self.emit('status', 'running');
  exec('ant run', options, function(error, stdout, stderr) {
    if(error) {
      return self.emit('error', error);
    }

    if(stderr) {
      console.log(error);
      self.emit('status', 'dirty');
      self.emit('error', new Error(error));
    } else {
      self.emit('status', 'executed');
      self.emit('executed', stdout);
    }
  });
};

JavaCompiler.prototype.test = function() {
  var self = this;
  var options = {
    cwd: this.workspace,
    //maxBuffer: 2000*1024,
    timeout: 5000
  };

  self.emit('status', 'testing');
  exec('ant test', options, function(error, stdout, stderr) {
    if(error) {
      return self.emit('error', error);
    }

    if(stderr) {
      console.log(error);
      self.emit('status', 'dirty');
      self.emit('error', new Error(error));
    } else {
      self.emit('status', 'tested');
      self.emit('tested', stdout);
    }
  });
};

module.exports.Compiler = JavaCompiler;
