var Compiler = require('../compiler').Compiler;

describe('Compiler', function() {
  it('is an event emitter', function(done) {
    var compiler = new Compiler();
    compiler.on('test', function() {
      done();
    });
    compiler.emit('test');
  });

  it('should throw error when workspace is not available', function(done) {
    var compiler = new Compiler({});
    compiler.on('error', function(error) {
      done();
    });
    compiler.compile();
  });

  it('should throw error when language is not available', function(done) {
    var compiler = new Compiler({
      workspace: 'dummy'
    });
    compiler.on('error', function(error) {
      done();
    });
    compiler.compile();
  });

  it('should throw error when version is not available', function(done) {
    var compiler = new Compiler({
      workspace: 'dummy',
      language: 'java'
    });
    compiler.on('error', function(error) {
      done();
    });
    compiler.compile();
  });

  it('should compile a sample file', function(done) {
    var compiler = new Compiler({
      workspace: '/Users/rakshit/nodeWorkspace/10xCompiler/test/sample',
      language: 'java',
      version: '1.6'
    });
    compiler.on('compiled', function() {
      done();
    });
    compiler.compile();
  });
});
