/* dependencies */

var Vue = require('vue');

module.exports = function () {

    var data = require('./data.js');
    return new Vue({
        el: '#page',
        mixins: [],
        data: data,
        ready () {
            this.socket.emit('requireAlbums');

            this.socket.on('sendAlbums', (list) => {
                console.log(list);
                this.album = list;
            });

            this.socket.on('sendAlbum', (album) => {
                console.log(album);
                this.album.current = album;
            });

            this.socket.on('action', (buttons) => {
                this.buttons = buttons;
                console.log(buttons);
            });

        },
        computed: {
        },
        methods: {
            showSocket () {
                console.log(this.socket);
            }
        }

    });
};
