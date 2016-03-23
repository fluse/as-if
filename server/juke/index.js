'use strict';
var Navigation = require('./navigation/'),
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
            onReady: this.scanner.start.bind(this.scanner)
        });

        this.state = 'albumList';
    }

    setPage (number) {
        this.scanner.currentPage = number;
    }

    getCurrentPage () {
        this.scanner.getList();
    }

    onSelection (value) {
        if (this.state === 'albumList') {
            this.prePareAlbum(value);
            this.state = 'trackList';
            return;
        }
        if (value === 1) {
            this.showAlbumList();
        }
    }

    showAlbumList() {
        this.state = 'albumList';
        this.app.config.player.album.current = false;
        this.app.io.sockets.emit('sendAlbum', false);
    }

    sendToDisplay() {
        console.log('sendToDisplay');
        this.app.io.sockets.emit('sendAlbums', this.app.config.player.album);
    }

    prePareAlbum (value) {
        var album = this.scanner.getAlbum(value - 1);
        console.log(album);
        this.app.config.player.album.current = album;
        this.app.io.sockets.emit('sendAlbum', this.app.config.player.album.current);
    }
}

module.exports = Juke;
