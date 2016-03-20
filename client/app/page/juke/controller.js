/* dependencies */

var Vue = require('vue');

module.exports = function () {

    var data = require('./data.js');
    return new Vue({
        el: '#page',
        mixins: [],
        data: data,
        ready () {
            this.socket.emit('requireAlbums', (list) => {
                this.album = list;
            });
            this.socket.on('getAlbums', (list) => {
                console.log(list);
                this.album = list;
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
