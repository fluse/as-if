## globals

#!/bin/sh

echo "install vinyl jukebox application dependecies"

brew -v foo >/dev/null 2>&1 || {
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
}

### brew

wget -v foo >/dev/null 2>&1 || {
    brew install wget
}

node -v foo >/dev/null 2>&1 || {
    brew install node
}

mongodb -v foo >/dev/null 2>&1 || {
    brew install mongodb
    sudo mkdir -p /data/db
    sudo chown -R $(whoami) /data/
}

npm install -g grunt
npm install -g browserify
npm install -g uglify-js
npm install -g bower
npm install -g nodemon
npm install -g stringify

npm install
