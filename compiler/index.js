var util = require('util');
var EventEmitter = require('events').EventEmitter;
var LanguageHelper = require('../languages').Helper;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

function Compiler(options) {
  var self = this;
  EventEmitter.call(this);

  this.options = options;

  /* 
   * status:
   *   raw - plain source code
   *   compiling - compiling source
   *   compiled - successfully compiled binaries
   *   dirty - compilation failed. Might have unfinished binary.
   *   running - running the binaries
   *   testing - testing the binaries with specified test cases
   */
  this.status = 'raw';

  this.languageHelper = new LanguageHelper();

  this.languageHelper.on('error', function(error) {
    self.emit('error', error);
  });

  this.languageHelper.on('done', function() {
    self.runCompiler();
  });
};

util.inherits(Compiler, EventEmitter);

Compiler.prototype.compile = function() {
  var workspace = this.options.workspace;
  var language = this.options.language;
  var version = this.options.version;

  if(!workspace) {
    return this.emit('error', new Error('No workspace specified.'));
  }
  if(!language) {
    return this.emit('error', new Error('No language specified.'));
  }
  if(!version) {
    return this.emit('error', new Error('No version specified.'));
  }

  // Apply language patches
  this.languageHelper.prepare(workspace, language, version);
};

Compiler.prototype.runCompiler = function() {
  var self = this;
  var workspace = this.options.workspace + '/*';

  var compiler = exec('javac ' + workspace, function(error, stdout, stderr) {
    if(error) {
      return self.emit('error', error);
    }

    if(stderr) {
      console.log(error);
      self.emit('error', new Error(error));
      self.emit('dirty');
    } else {
      self.emit('compiled');
    }
  });
};

module.exports.Compiler = Compiler;
