'use strict';

var fs = require('fs'),
    mp3Parser = require('musicmetadata'),
    glob = require('glob'),
    async = require('async'),
    _ = require('lodash');

module.exports = class mp3Scanner {

    constructor (app, onFinish) {
        this.app = app;
        this.onFinish = onFinish;
        this.currentPage = 1;
        this.chunkSize = 120;
        this.list = [];
        //this.start();
    }

    start () {
        // options is optional
        glob(__dirname + '/../../media/**/*.mp3', (er, files) => {
            async.eachSeries(files, (file, cb) => {
                // parse mp3 for id3 tags
                mp3Parser(fs.createReadStream(file), (err, metadata) => {
                    if (!err) {
                        this.saveCover(metadata);
                        this.mapData(metadata);
                    } else {
                        console.log(err);
                    }
                    console.log("%s - %s", metadata.artist[0], metadata.title);
                    cb();
                });

            }, () => {
                console.log('ready');
                this.sort();
                this.paginate();
                this.onFinish(this.getList());
            });
        });
    }

    sort () {
        this.list = _.sortBy(this.list, function(o) { return o.albumartist; });
    }

    getList () {
        var albums = _.cloneDeep(this.list[this.currentPage - 1]);
        for (let album of albums) {
            delete album.tracks;
        }
        return albums;
    }

    getAlbum (pos) {
        var album = _.cloneDeep(this.list[this.currentPage - 1][pos]);

        return album;
    }

    paginate () {
        this.list = _.chunk(this.list, this.chunkSize);
    }

    mapData (metadata) {
        //console.log(metadata);
        // is created
        var result = _.find(this.list, function(o) {
            return o.albumartist === metadata.artist[0] && o.album === metadata.album;
        });

        if (!result) {
            var imagePath = metadata.picture.length > 0 ? 'public/cover/' + metadata.album + '.' + metadata.picture[0].format : '';
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
            var fileNameAndPath = __dirname + '/../../public/cover/' + metadata.album + '.' + metadata.picture[0].format;
            var coverData = metadata.picture[0].data;

            fs.writeFile(fileNameAndPath, coverData, function (err) {
                if (err) {
                    throw (err);
                }
            });
        }
    }
};
