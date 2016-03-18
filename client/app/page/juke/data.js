/* globals response */

var extend = require('extend');
var socket = require('socket.io-client')();

module.exports = function () {

    return extend({
        socket: socket,
        albums: [],
        buttons: [],
    }, response);

};
