/* globals response */

var extend = require('extend');
var socket = require('socket.io-client')('http://' + window.location.hostname + ':4711');

module.exports = function () {

    return extend({
        audio: null,
        socket: socket,
        album: {
            activeTrack: {},
            list: [],
            current: false
        },
        state: {
            buttons: [],
            volume: 0,
            pressed: {
                first: {
                    name: ''
                },
                second: {
                    name: ''
                }
            }
        }
    }, response);

};
