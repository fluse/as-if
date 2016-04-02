'use strict';
var Navigation = require('./navigation/board.js'),
    Scanner = require('./scanner.js');

class Juke {
    constructor (app) {
        this.app = app;

        this.scanner = new Scanner(app, (list) => {
            this.app.config.player.album.list = list;
            this.sendToDisplay();
        });

        this.navigation = new Navigation(app, {
            onSelection: this.onSelection.bind(this),
            onReady: () => {}
        });

        this.state = 'albumList';
    }

    setPage (newPagePosition) {
        console.log('current page %s', this.scanner.currentPage);
        console.log('album pages length %s', this.getAlbumListCount());
        var newPage = this.scanner.currentPage + newPagePosition;
        if (newPage < 1) {
            newPage = this.getAlbumListCount();
        }

        if (this.getAlbumListCount() < newPage) {
            newPage = 1;
        }

        console.log('new page number %s', newPage);

        this.scanner.currentPage = newPage;
        this.setAlbumList();
        this.sendToDisplay();
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

    onSelection (result) {

        if (this.checkPaginationAction(result)) {
            return;
        }

        console.log(result.pressed);

        if (this.playTrackIfAlbumIsSet(result)) {
            console.log('playTrackIfCurrentIsSet');
            return;
        }

        if (this.showAlbumListIfCurrentIsSet(result)) {
            console.log('showAlbumListIfCurrentIsSet');
            return;
        }

        if (this.showAlbum(result)) {
            console.log('showAlbum');
            return;
        }

        this.navigation.selectionManager.clear();
        this.sendToDisplay();
    }

    playTrackIfAlbumIsSet(result) {

        // all first restricted
        if (this.state !== 'trackList' || result.pressed.second.count === 1) {
            console.log('1 is restricted');
            return false;
        }

        var album = this.app.config.player.album.current;

        // set current active track
        if (album !== false && album.tracks.length >= result.value) {

            var track = this.app.config.player.album.activeTrack;

            track = album.tracks[result.value - 2];
            console.log('tracklist length %s', album.tracks.length);
            console.log('track position %s', result.value - 2);
            console.log(track);

            return true;
        }

        return false;
    }

    checkPaginationAction(result) {
        if (result.pressed.first.type === 'pagePrevous' || result.pressed.first.type === 'pageNext') {

            if (!this.navigation.selectionManager.isPaginationActive) {
                return true;
            }

            this.navigation.selectionManager.isPaginationActive = false;

            if (result.pressed.first.type === 'pagePrevous') {
                this.setPage(-1);
                return true;
            }

            if (result.pressed.first.type === 'pageNext') {
                this.setPage(1);
                return true;
            }

            this.navigation.selectionManager.clear();
            this.sendToDisplay();
            return true;
        }

        return false;
    }

    showAlbum(result) {
        if (this.state === 'albumList') {
            this.state = 'trackList';
            this.navigation.selectionManager.clear();
            this.prePareAlbum(result.value);

            this.sendToDisplay();
            return;
        }
    }

    showAlbumListIfCurrentIsSet(result) {

        if (this.state === 'trackList' && !result.pressed.first.isPressed && result.pressed.second.count === 1) {
            this.state = 'albumList';
            this.app.config.player.album.current = false;
            this.app.config.player.album.activeTrack = false;
            this.navigation.selectionManager.clear();
            this.sendToDisplay();
            return true;
        }

        return false;
    }

    sendToDisplay() {
        console.log('displayUpate');
        this.app.io.sockets.emit('displayUpate', this.app.config.player.album);
    }

    prePareAlbum (value) {
        var album = this.scanner.getAlbum(value - 1);
        if (album !== false) {
            this.app.config.player.album.current = album;
        }
    }
}

module.exports = Juke;
