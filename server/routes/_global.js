'use strict';

// generate camelCase Name for jsController
var convertToCamelCase = function (string) {
    // create array by directories
    let page = string.split('/');
    // set each firstUC
    for (let i = 0; i < page.length; i++) {
        if (i > 0) page[i] = page[i].charAt(0).toUpperCase() + page[i].slice(1);
    }
    // create string
    return page.join('');
};

module.exports = (app) => {
    // set default page response and request
    app.get('*', (req, res, next) => {

        res.renderPage = (settings, response) => {

            settings.controller = convertToCamelCase(settings.page);

            res.render('page/' + settings.page, {
                response: Object.assign({}, app.config.response, response),
                request: Object.assign({}, app.config.request || {}, settings),
                layout: settings.layout || app.config.layout.defaultTemplate
            });

        };

        next();
    });
};
