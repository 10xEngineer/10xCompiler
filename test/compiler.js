var Compiler = require('../compiler/java').Compiler;
var vfsLocal = require('vfs-local');

describe('Compiler', function() {
  it('should throw error when vfs is not available', function() {
    (function() {
      var compiler = new Compiler({});
    }).should.throw(/vfs/);
  });

  it('should throw error when language is not available', function() {
    (function() {
      var compiler = new Compiler({
        vfs: 'dummy'
      });
    }).should.throw(/language/);
  });

  it('should throw error when version is not available', function() {
    (function() {
      var compiler = new Compiler({
        vfs: 'dummy',
        language: 'java'
      });
    }).should.throw(/version/);
  });

  it('should be an event emitter', function(done) {
    var compiler = new Compiler({
      vfs: 'dummy',
      language: 'java',
      version: '1.6'
    });
    compiler.on('test', function() {
      done();
    });
    compiler.emit('test');
  });

  describe('valid compiler', function() {
    var compiler = new Compiler({
      vfs: vfsLocal({ root: process.cwd() + '/test/validSample/' }),
      language: 'java',
      version: '1.6'
    });

    it('should successfully prepare workspace', function(done) {
      compiler.on('status', function(status) {
        if(status === 'prepared') {
          done();
        }
      });
      compiler.prepare();
    });

    it('should compile a sample file', function(done) {
      compiler.on('compiled', function() {
        done();
      });
      compiler.compile();
    });
  });

  describe('invalid compiler', function() {
    var compiler = new Compiler({
      vfs: vfsLocal({ root: process.cwd() + '/test/invalidSample/' }),
      language: 'java',
      version: '1.6'
    });

    it('should return error for compilation failure', function(done) {
      compiler.on('error', function(error) {
        error.should.be.an.instanceOf(Error);
        error.toString().should.match(/';' expected/);
        done();
      });
      compiler.on('status', function(status) {
        if(status === 'prepared') {
          compiler.compile();
        }
      });
      compiler.prepare();
    });
  });
});
