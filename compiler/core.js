var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Compiler(options) {
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
  // TODO: Move this validation to main task file
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

util.inherits(Compiler, EventEmitter);


module.exports.Compiler = Compiler;
