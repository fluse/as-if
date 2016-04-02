'use strict';

var fs = require('fs'),
    mp3Parser = require('musicmetadata'),
    glob = require('glob'),
    async = require('async'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    jsonfile = require('jsonfile');

module.exports = class mp3Scanner {

    constructor (app, onFinish) {
        this.app = app;
        this.onFinish = onFinish;
        this.currentPage = 3;
        this.chunkSize = 120;
        this.jsonFilePath = './server/juke/albums.json';
        this.list = [];
        jsonfile.spaces = 4;

        this.getListfromFileSystem();
    }

    getListfromFileSystem () {
        jsonfile.readFile(this.jsonFilePath, (err, list) => {
            if (err) {
                console.log(err);
                return;
            }
            this.list = list;
            console.log('get list from file');
            console.log('list pages %s', this.list.length);
            this.onFinish(this.getList());
        });
    }

    start () {
        this.list = [];
        // options is optional
        glob(__dirname + '/../../media/**/*.mp3', (er, files) => {
            files.forEach(function(file) {
                var dir = path.dirname(file);
                var filename = path.basename(file);
                fs.renameSync(file, dir + '/' + filename.replace(/[^.A-Z0-9/]/ig, '-'));
            });

            async.eachSeries(files, (file, cb) => {
                // parse mp3 for id3 tags
                mp3Parser(fs.createReadStream(file), (err, metadata) => {
                    if (err) {
                        console.log(err);
                        return cb();
                    }

                    this.saveCover(metadata, () => {
                        this.mapData(file, metadata);
                    });

                    cb();
                });

            }, () => {
                console.log('ready');
                this.clean();
                this.sort();
                this.paginate();
                this.finish(this.list);
            });
        });
    }

    clean () {

    }

    finish(list) {
        jsonfile.writeFile(this.jsonFilePath, list, (err) => {
            if (err) {
                console.error('write file error %s', JSON.stringify(err));
            }
        });

        this.onFinish(this.getList());
    }

    sort () {
        this.list = _.sortBy(this.list, function(o) {
            return o.albumartist;
        });
    }

    getList () {
        if (this.list.length < this.currentPage) {
            this.currentPage = 1;
        }
        var albums = _.cloneDeep(this.list[this.currentPage - 1]);

        for (var i = 0; i < albums.length; i++) {
            delete albums[i].tracks;
        }

        return albums;
    }

    getAlbum (pos) {
        try {
            var list = this.list[this.currentPage - 1];

            if (list.length < pos || pos < 0) {
                return false;
            }

            return list[pos];
        } catch (e) {
            return false;
        }
    }

    paginate () {
        this.list = _.chunk(this.list, this.chunkSize);
    }

    mapData (filePath, metadata) {
        //console.log(metadata);
        // is created
        var artist = this.getArtist(metadata);
        var fileName = artist.replace(/[^A-Z0-9/]/ig, '-').toLowerCase() + metadata.album.replace(/[^A-Z0-9/]/ig, '-').toLowerCase();
        var fileFormat = metadata.picture[0].format;
        var imagePath = metadata.picture.length > 0 ? 'cover/' + fileName + '.' + fileFormat : '';

        var result = _.find(this.list, function(o) {
            return o.albumartist === artist && o.album === metadata.album;
        });

        // remove special chars from filename
        metadata.filePath = '/media/' + filePath.replace(/^.*[\\\/]/, '');


        metadata.artist = artist;
        if (metadata.picture) {
            metadata.picture = null;
            delete metadata.picture;
            delete metadata.disk;
            delete metadata.albumartist;
            metadata.number = metadata.track.no;
            delete metadata.track;
        }

        if (!result) {

            var album = {
                albumartist: artist,
                album: metadata.album,
                year: metadata.year,
                cover: imagePath,
                tracks: [metadata]
            };
            console.log('add album %s - %s', album.albumartist, album.album);
            this.list.push(album);
            //console.log(JSON.stringify(album));
            // create album entry

        } else {
            // write track to list
            try {
                var isMatch = _.find(result.tracks, function(o) {
                    return o.title === metadata.title;
                });
                if (!isMatch) {
                    result.tracks.push(metadata || {});

                    result.tracks = _.sortBy(result.tracks, function(o) {
                        return o.number;
                    });
                }
            } catch (e) {
                //console.error('cant push %s', JSON.stringify(result));
            }
        }

    }

    getArtist(metadata) {
        if (metadata.albumartist.length) {
            return metadata.albumartist[0];
        }
        if (metadata.artist.length) {
            return metadata.artist[0];
        }
        return 'no artist name defined';
    }

    saveCover (metadata, cb) {

        if (metadata.picture.length > 0) {
            var artist = metadata.albumartist.length > 0 ? metadata.albumartist[0] : metadata.artist[0];
            // generate cover filename
            var fileName = artist.replace(/[^A-Z0-9/]/ig, '-').toLowerCase() + metadata.album.replace(/[^A-Z0-9/]/ig, '-').toLowerCase();
            fileName = fileName.replace(/\//ig, '');
            // generate cover full path
            var fileNameAndPath = __dirname + '/../../public/cover/' + fileName + '.' + metadata.picture[0].format;
            var coverData = metadata.picture[0].data;
            fs.writeFile(fileNameAndPath, coverData, function (err) {
                if (err) {
                    throw (err);
                }
                cb();
            });

        }
    }
};
