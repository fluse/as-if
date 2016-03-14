var fs = require('fs');
var mm = require('musicmetadata');

/* create a new parser from a node ReadStream
var parser = mm(fs.createReadStream('./../Documents/PierreStulier/sample.mp3'), function (err, metadata) {
  if (err) throw err;
  console.log(metadata);
});
*/
var glob = require("glob");

var path = './media/**/*.*';

// options is optional
glob(path, function (er, files) {

    for (var file in files) {
        var parser = mm(fs.createReadStream(files[file]), function (err, metadata) {

            if (metadata.picture.length > 0) {
                fs.writeFile(metadata.album + '.' + metadata.picture[0].format, metadata.picture[0].data, function (err) {
                    console.log('done');
                });
            }

          //if (err) throw err;
          console.log(metadata);
        });
    }

    console.log(files.length);
});
