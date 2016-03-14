var requireAll = require('require-all');

var configs = requireAll(__dirname + '/');

module.exports = function (app) {
    app.config = configs;
    return app;
};
