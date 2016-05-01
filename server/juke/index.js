'use strict';
var Navigation = require('./navigation/board.js'),
    Scanner = require('./scanner.js'),
    Player = require('./player');

class Juke {

    constructor (app) {
        this.app = app;

        this.player = Player();

        this.scanner = new Scanner(app, (list) => {
            this.app.config.player.album.list = list;
            this.sendToDisplay();
        });

        this.navigation = new Navigation(app, {
            onSelection: this.onSelection.bind(this),
            onVolumeChange: this.onVolumeChange.bind(this),
            onReady: () => {}
        });

        this.state = 'albumList';
    }

    setPage (newPagePosition) {

        var newPage = this.scanner.currentPage + newPagePosition;

        // skip to last
        if (newPage < 1) {
            newPage = this.getAlbumListCount();
        }

        // skip to first
        if (this.getAlbumListCount() < newPage) {
            newPage = 1;
        }

        console.log('new page number %s', newPage);

        this.scanner.currentPage = newPage;
        this.setAlbumList();
    }

    getCurrentPage () {
        return this.scanner.getList();
    }

    getAlbumListCount() {
        return this.scanner.list.length;
    }

    setAlbumList() {
        this.app.config.player.album.list = this.scanner.getList();
    }

    onVolumeChange(volume) {
        this.player.setVolume(volume);
    }

    onSelection (result) {
        if (this.paginate(result)) {
            return;
        }

        if (this.playTrack(result)) {
            return;
        }

        if (this.goBack(result)) {
            return;
        }

        if (this.showAlbum(result)) {
            return;
        }

        this.navigation.selectionManager.clear();
        this.sendToDisplay();
    }

    playTrack(result) {

        if (result.pressed.second === null) {
            return false;
        }

        if (this.state !== 'trackList') {
            return false;
        }

        // all 1 buttons restircted
        if (result.pressed.second.count === 1) {
            if (result.pressed.first.name !== 'A') {
                console.log('%s%s blocked in tracklist mode',
                    result.pressed.first.name,
                    result.pressed.second.name
                );

            }
            return false;
        }

        var album = this.app.config.player.album.current;
        var value = result.pressed.first.onAlbum + result.pressed.second.count;
        var trackPosition = value - 2;

        // set current active track
        if (album !== false && album.tracks.length > trackPosition) {

            var track = album.tracks[trackPosition];
            this.app.config.player.album.activeTrack = track;
            console.log('track %s - %s', track.albumartist, track.title);

            this.player.play(__dirname + '/../../' + track.filePath);

            return this.sendToDisplay();
        }

        return false;
    }

    paginate(result) {

        if (result.pressed.first.type === 'pagePrevous' || result.pressed.first.type === 'pageNext') {
            this.setPage(result.pressed.first.type === 'pagePrevous' ? -1 : 1);

            return this.sendToDisplay();
        }

        return false;
    }

    showAlbum(result) {

        if (this.state !== 'albumList') {
            return false;
        }

        this.state = 'trackList';

        this.navigation.selectionManager.clear();

        this.prePareAlbum(result.value);

        return this.sendToDisplay();
    }

    goBack(result) {

        if (this.state !== 'trackList') {
            return false;
        }

        if (result.pressed.second.count !== 1) {
            return false;
        }

        if (result.pressed.first.name !== 'A') {
            return false;
        }

        this.state = 'albumList';
        this.app.config.player.album.current = false;
        this.app.config.player.album.activeTrack = false;
        this.navigation.selectionManager.clear();

        return this.sendToDisplay();
    }

    sendToDisplay() {
        console.log('displayUpate');
        this.app.io.sockets.emit('displayUpate', this.app.config.player.album);
        return true;
    }

    prePareAlbum (value) {
        var album = this.scanner.getAlbum(value - 1);
        if (album !== false) {
            this.app.config.player.album.current = album;
        }
    }
}

module.exports = Juke;
