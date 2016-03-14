var glob = require('glob'),
    path = require('path');

module.exports = (app) => {
    // get all routes from files excluding index.js
    glob.sync('./server/routes/**/!(index).js').forEach((file) => {
        require(path.resolve(file))(app);
    });
};
