var albumScanner = require('./../../scan.js');
var extend = require('extend');
module.exports = function (app) {

    app.get('/', (req, res) => {

        res.renderPage({
            page: 'juke'
        }, {
            albums: []
        });

        albumScanner.start((list) => {
            app.config.player.albums = list;

            app.io.sockets.emit('getAlbums', app.config.player.albums);
        });
    });

};
