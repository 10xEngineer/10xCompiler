var util = require('util');
var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

function JavaCompiler(options) {
  var self = this;
  EventEmitter.call(this);

  // Validations
  if(!options) {
    return self.emit('error', new Error('Compiler options not present.'));
  }

  var vfs = options.vfs;
  var language = options.language;
  var version = options.version;

  if(!vfs) {
    return self.emit('error', new Error('No vfs specified.'));
  }
  if(!language) {
    return self.emit('error', new Error('No language specified.'));
  }
  if(!version) {
    return self.emit('error', new Error('No version specified.'));
  }

  this.options = options;

  /* 
   * status:
   *   raw - plain source code
   *   prepared - source code prepared for compilation
   *   compiling - compiling source
   *   compiled - successfully compiled binaries
   *   dirty - compilation failed. Might have unfinished binary.
   *   running - running the binaries
   *   executed - successfully executed binaries, emits stdout
   *   testing - testing the binaries with specified test cases
   *   tested - successfully tested the binaries with specified test cases
   */
  this.status = 'raw';

  this.on('change', function(status) {
    self.status = status;
  });
}

util.inherits(JavaCompiler, EventEmitter);

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
