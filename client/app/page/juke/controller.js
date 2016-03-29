/* dependencies */

var Vue = require('vue');

module.exports = function () {

    var data = require('./data.js');
    return new Vue({
        el: '#page',
        mixins: [],
        data: data,
        ready () {
            this.audio = new Audio();
            this.socket.on('displayUpate', (list) => {
                console.log(list);
                this.album = list;

                if (list.activeTrack !== false) {
                    console.log(list.activeTrack.filePath);
                    this.audio.pause();
                    this.audio = null;
                    this.audio = new Audio(list.activeTrack.filePath);
                    console.log(this.audio);
                    this.audio.play();
                }
            });

            this.socket.on('getState', (state) => {
                this.audio.volume = state.volume / 100;
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
