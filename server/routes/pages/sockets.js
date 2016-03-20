module.exports = function (app) {

    app.io.sockets.on('connection', function (socket) {

        socket.on('requireAlbums', () => {
            socket.emit('sendAlbums', app.config.player.album);
        });

    });
};
