'use strict';

var fs = require('fs'),
    mp3Parser = require('musicmetadata'),
    glob = require('glob'),
    async = require('async'),
    _ = require('lodash'),
    lwip = require('lwip'),
    path = require("path"),
    fs = require("fs");

module.exports = class mp3Scanner {

    constructor (app, onFinish) {
        this.app = app;
        this.onFinish = onFinish;
        this.currentPage = 1;
        this.chunkSize = 120;
        this.list = [];
        this.start();
        //this.onFinish();
    }

    start () {
        // options is optional
        glob(__dirname + '/../../media/**/*.mp3', (er, files) => {
            files.forEach(function(file) {
                var dir = path.dirname(file);
                var filename = path.basename(file);
                fs.renameSync(file, dir + "/" + filename.replace(/[^.A-Z0-9/]/ig, '-'));
            });

            async.eachSeries(files, (file, cb) => {
                // parse mp3 for id3 tags
                mp3Parser(fs.createReadStream(file), (err, metadata) => {
                    if (!err) {
                        this.mapData(file, metadata);
                        console.log("%s - %s", metadata.artist[0], metadata.title);
                    } else {
                        console.log(err);
                    }

                    cb();
                });

            }, () => {
                console.log('ready');
                this.clean();
                this.sort();
                this.paginate();
                this.onFinish(this.getList());
            });
        });
    }

    clean () {
        for (let album in this.list) {
            if (!this.list[album].hasOwnProperty('tracks') || this.list[album].tracks.length === 0) {
                delete this.list[album];
            }
        }
    }

    sort () {
        this.list = _.sortBy(this.list, function(o) { return o.albumartist; });
    }

    getList () {


        var albums = _.cloneDeep(this.list[this.currentPage - 1]);
        for (let album of albums) delete album.tracks;

        return albums;
    }

    getAlbum (pos) {
        return this.list[this.currentPage - 1][pos];
    }

    paginate () {
        this.list = _.chunk(this.list, this.chunkSize);
    }

    mapData (filePath, metadata) {
        //console.log(metadata);
        // is created
        var result = _.find(this.list, function(o) {
            return o.albumartist === metadata.artist[0] && o.album === metadata.album;
        });

        var fileName = metadata.album.replace(/[^A-Z0-9/]/ig, '-').toLowerCase();
        var fileFormat = metadata.picture[0].format;
        var imagePath = metadata.picture.length > 0 ? 'cover/' + fileName + '.' + fileFormat : '';
        metadata.filePath = '/media/' + filePath.replace(/^.*[\\\/]/, '');
        if (!result) {
            // remove special chars from filename


            this.saveCover(metadata);
            if (metadata.picture) {
                delete metadata.picture;
            }



            // create album entry
            this.list.push({
                albumartist: metadata.albumartist.length > 0 ? metadata.albumartist[0] : metadata.artist[0],
                album: metadata.album,
                year: metadata.year,
                tracks: [metadata],
                cover: imagePath
            });
        } else {
            if (metadata.picture) {
                delete metadata.picture;
            }
            // write track to list
            result.tracks.push(metadata || {});
        }

    }

    saveCover (metadata) {

        if (metadata.picture.length > 0) {
            var fileName = metadata.album.replace(/[^A-Z0-9/]/ig, '-').toLowerCase();
            var fileNameAndPath = __dirname + '/../../public/cover/' + fileName + '.' + metadata.picture[0].format;
            var coverData = metadata.picture[0].data;
            lwip.open(coverData, metadata.picture[0].format, function(err, image) {
                if (err) {
                    console.log(err);
                    return;
                }
                try {
                    console.log(fileNameAndPath);
                    image.batch().crop(150, 150).writeFile(fileNameAndPath, function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                } catch (e) {

                }
            });

        }
    }
};
