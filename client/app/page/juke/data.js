/* globals response */

var extend = require('extend');
var socket = require('socket.io-client')('http://' + window.location.hostname + ':4711');

module.exports = function () {

    return extend({
        socket: socket,
        albums: []
    }, response);

};
