var fs = require('fs'),
    mm = require('musicmetadata'),
    glob = require('glob'),
    async = require('async');

module.exports = {

    list: [],

    start (cb) {
        var readPath = __dirname + '/../media/**/*.mp3';
        var writePath = __dirname + '/../public/cover/';

        // options is optional
        glob(readPath, (er, files) => {
            async.each(files, (file, cb2) => {
                // Call an asynchronous function, often a save() to DB
                var parser = mm(fs.createReadStream(file), (err, metadata) => {

                    if (!err && metadata.picture.length > 0) {

                        if (!this.list.hasOwnProperty(metadata.album)) {
                            this.list[metadata.album] = [metadata];
                        } else {
                            this.list[metadata.album].push(metadata);
                        }


                        fs.writeFile(writePath + metadata.album + '.' + metadata.picture[0].format, metadata.picture[0].data, function (err) {
                            if (err) {
                                throw (err);
                            }


                            //if (err) throw err;
                        });
                    }
                    cb2();
                });
            }, (err) => {
                  cb(this.list);
            });
        });

    }


};
