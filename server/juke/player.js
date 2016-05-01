var lame = require('lame');
var fs = require('fs');
var Speaker = require('speaker');
var volume = require('pcm-volume');

var audioOptions = {
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100,
    mode: lame.STEREO
};

var AudioSpeaker = null;
var decoder = null;
var v = null;

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
                v = new volume();
                v.pipe(AudioSpeaker);
                decoder.pipe(v);
                inputStream.pipe(decoder);

                this.setVolume(0.7);
            }, 100);
        },

        setVolume (value) {
            console.log(value);
            if (value && v !== null) {
                v.setVolume(value);
            }
        }
    };

};
