var fs = require('fs');
var path = require('path');

var async = require('async');

module.exports.copyResources = function(options, callback) {
  callback();
};

module.exports.copyFromVfs = function(options, callback) {
  if(!options || !options.vfs || !options.dest) {
    return callback(new Error('One of required params not present.'));
  }

  // Verify if destination is valid
  if(!fs.existsSync(options.dest)) {
    return callback(new Error('Dest path doesn not exist.'));
  }

  copyVfsDir(options.vfs, '/', options.dest, callback);
};

var copyVfsDir = function(vfs, src, dest, callback) {
  // Create the directory if doesn't exist
  if(!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  // Read VFS directory contents
  vfs.readdir(src, {}, function(error, meta) {
    var stream = meta.stream;
    var dirs = [];
    var files = [];

    stream.on('error', function(error) {
      callback(error);
    });

    stream.on('data', function(data) {
      if(data.mime === 'inode/directory') {
        dirs.push(data.name);
      } else {
        files.push(data.name);
      }
    });

    stream.on('end', function() {
      async.every(dirs, function(name, callback) {
        copyVfsDir(vfs, path.join(src, name), path.join(dest, name), callback);
      }, function(error) {
        async.every(files, function(name, callback) {
          copyVfsFile(vfs, path.join(src, name), path.join(dest, name), callback);          
        }, function(error) {
          console.log('Created workspace at ' + dest);
          callback(error);
        });
      });
    });
  });
};

var copyVfsFile = function(vfs, src, dest, callback) {
  var writeStream = fs.createWriteStream(dest, { mode: 0777 });

  vfs.readfile(src, {}, function(error, meta) {
    meta.stream.pipe(writeStream);

    meta.stream.on('end', callback);
  });
};
