var fs = require('fs'),
    mm = require('musicmetadata'),
    glob = require('glob'),
    async = require('async');

module.exports = {

    list: [],

    start (cb) {
        var readPath = './../media/**/*.*';
        var writePath = './../public/cover/';

        // options is optional
        glob(readPath, function (er, files) {

            async.each(files, (file, cb2) => {
                // Call an asynchronous function, often a save() to DB
                var parser = mm(fs.createReadStream(files[file]), (err, metadata) => {

                    if (!err && metadata.picture.length > 0) {
                        fs.writeFile(writePath + metadata.album + '.' + metadata.picture[0].format, metadata.picture[0].data, function (err) {
                            if (err) {
                                throw (err);
                            }
                            console.log('done');
                        });
                    }
                    cb2();
                  //if (err) throw err;
                  console.log(metadata);
                });
              }, function(err) {
                  cb([]);
              }
            );
        });

    }


};
