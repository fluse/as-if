var async = require('async');
var lame = require('lame');
var fs = require('fs');
var Speaker = require('speaker');
var volume = require("pcm-volume");

var audioOptions = {
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100,
    mode: lame.STEREO
};

var AudioSpeaker = null;
var decoder = null;
function playStream(input, options) {

    options = options || {};
    var v = new volume();
    if (options.volume) {
        v.setVolume(options.volume);
    }

    AudioSpeaker.on('finish', function() {

    });
    function start() {
        //input.pos = 0;
        decoder.pipe(AudioSpeaker);
        input.pipe(decoder);
    }
    start();
}

module.exports = function () {
    var inputStream = null;
    return {
        play (song) {
            if (inputStream !== null) {
                inputStream.unpipe();
            }
            if (AudioSpeaker !== null) {
                AudioSpeaker.end();
            }
            setTimeout(() => {
                inputStream = fs.createReadStream(song);
                decoder = lame.Decoder();
                AudioSpeaker = new Speaker(audioOptions);

                playStream(inputStream, {
                    volume: 0.5,
                    loop: false
                });
            }, 100);
        }
    };

};
