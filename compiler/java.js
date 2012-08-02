var util = require('util');
var CoreCompiler = require('./core').Compiler;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

function JavaCompiler(options) {
  var self = this;
  CoreCompiler.call(this, options);
}

util.inherits(JavaCompiler, CoreCompiler);

JavaCompiler.prototype.prepare = function() {
  var self = this;

  // TODO: Determine and set absolute paths for compilers, ant etc.

  // TODO: Create a temporary workspace in /tmp

  // TODO: Get the source code from specified vfs to workspace/src

  // TODO: Copy required resources to workspace

  self.emit('status', 'prepared');
  self.emit('done');
};

JavaCompiler.prototype.clean = function() {
  var self = this;
  var options = {
    cwd: this.options.workspace
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
    cwd: this.options.workspace
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
    cwd: this.options.workspace,
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
    cwd: this.options.workspace,
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
