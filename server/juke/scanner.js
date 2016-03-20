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
        this.start();
    }

    start () {
        // options is optional
        glob(__dirname + '/../../media/**/*.mp3', (er, files) => {
            async.each(files, (file, cb) => {
                // parse mp3 for id3 tags
                mp3Parser(fs.createReadStream(file), (err, metadata) => {
                    if (!err) {
                        this.mapData(metadata);
                        this.saveCover(metadata);
                    }
                    cb();
                });
            }, () => {
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
        return this.list[this.currentPage - 1];
    }

    paginate () {

        function chunk(arr, chunkSize) {
            var R = [];
            for (var i = 0,len = arr.length; i < len; i += chunkSize) {
                R.push(arr.slice(i,i+chunkSize));
            }
            return R;
        }
        this.list = chunk(this.list, this.chunkSize);
    }

    mapData (metadata) {
        //console.log(metadata);
        // is created
        var result = _.find(this.list, function(o) {
            return o.albumartist === metadata.albumartist[0] && o.album === metadata.album;
        });

        if (!result) {
            var imagePath = metadata.picture.length > 0 ? 'public/cover/' + metadata.album + '.' + metadata.picture[0].format : '';

            // create album entry
            this.list.push({
                albumartist: metadata.albumartist[0],
                album: metadata.album,
                year: metadata.year,
                tracks: [metadata.track],
                cover: imagePath
            });
        } else {
            // write track to list
            result.tracks.push(metadata.track || {});
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
