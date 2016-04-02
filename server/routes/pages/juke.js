module.exports = function (app) {

    app.get('/', (req, res) => {

        res.renderPage({
            page: 'juke'
        }, {} /* data object */);
    });

    app.get('/generate', (req, res) => {

        app.juke.scanner.start();

        res.redirect('/');
    });

};
