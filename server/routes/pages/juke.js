var albumScanner = require('./../../scan.js');

module.exports = function (app) {

    app.get('/', (req, res) => {


        res.renderPage({
            page: 'juke'
        }, {
            albums: []
        });

        albumScanner.start((list) => {
            // render page
            app.io.sockets.emit('getAlbums', list);
        });
    });

};
