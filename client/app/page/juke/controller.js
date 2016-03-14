/* dependencies */

var Vue = require('vue');

module.exports = function () {

    var data = require('./data.js');

    return new Vue({
        el: '#page',
        mixins: [],
        data: data,
        ready () {
            this.socket.on('getAlbums', (list) => {
                console.log(list);
                this.albums = list;
            });

        },
        computed: {
        },
        methods: {

        }

    });
};
