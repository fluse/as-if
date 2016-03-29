module.exports = function (app) {

    app.io.sockets.on('connection', function (socket) {
        socket.emit('displayUpate', app.config.player.album);

    });
};
