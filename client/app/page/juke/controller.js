/* dependencies */

var Vue = require('vue');

module.exports = function () {

    var data = require('./data.js');
    return new Vue({
        el: '#page',
        mixins: [],
        data: data,
        ready () {
            this.socket.on('displayUpate', (list) => {
                this.album = list;
            });

            this.socket.on('getState', (state) => {
                this.state = state;
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
