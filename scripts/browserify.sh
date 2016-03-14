# app js
browserify -t [ babelify --presets [ es2015 react ] ] ./../client/app/juke.js -o ./../public/dist/app.js
