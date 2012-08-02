var util = require('util');
var EventEmitter = require('events').EventEmitter;


// workflow methods

var prepare = function(bus, options, next) {
  // Initialize the respective compiler based on language
  var langCompiler = require('./' + language);
  var compiler;
  if(!langCompiler) {
    return next(new Error('Language not supported.'));
  } else {
    compiler = new langCompiler.Compiler(options);
  }

  
};



// Task

function CompilerWorkflow() {
  return {
    flow: [],
    on_error: error,
    timeout: 0
  };
};

module.exports = CompilerWorkflow;
