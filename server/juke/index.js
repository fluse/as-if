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

    setPage (number) {
        this.scanner.currentPage = number;
    }

    getCurrentPage () {
        this.scanner.getList();
    }

    onSelection (result) {
        if (this.state === 'albumList') {
            this.prePareAlbum(result.value);
            this.state = 'trackList';
            return;
        }

        if (result.pressed.first.name === 'A' && result.value === 1) {
            return this.showAlbumList();
        }


        this.app.config.player.album.activeTrack = this.app.config.player.album.current.tracks[result.value - 1];
        console.log(this.app.config.player.album.activeTrack);
        this.sendToDisplay();
    }

    showAlbumList() {
        this.state = 'albumList';
        this.app.config.player.album.current = false;
        this.app.config.player.album.activeTrack = false;
        this.sendToDisplay();
    }

    sendToDisplay() {
        console.log('displayUpate');
        this.app.io.sockets.emit('displayUpate', this.app.config.player.album);
    }

    prePareAlbum (value) {
        var album = this.scanner.getAlbum(value - 1);

        this.app.config.player.album.current = album;

        this.sendToDisplay();
    }
}

module.exports = Juke;
