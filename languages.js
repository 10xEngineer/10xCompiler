var util = require('util');
var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;

/*
 * LanguageHelper - Prepares the source code for compilation
 * 
 * Events:
 *   done: Finished preparing the source
 *   error: An error occured while preparing the source
 */
function LanguageHelper() {
  EventEmitter.call(this);
  this.status = 'idle';
}

util.inherits(LanguageHelper, EventEmitter);

LanguageHelper.prototype.prepare = function(workspace, language, version) {

  // TODO: Wait till the status is 'idle'

  switch(language) {
    case 'java':
      this.prepareJava(workspace, version);
      break;
    default:
      this.emit('error', new Error(language + ' is not a compatible language.'));
  }
};

LanguageHelper.prototype.prepareJava = function(workspace, version) {
  var self = this;
  if(version == '1.6') {
    self.emit('done');
  }
};

module.exports.Helper = LanguageHelper;
