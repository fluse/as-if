module.exports = function (app) {

    app.get('/', (req, res) => {

        res.renderPage({
            page: 'juke'
        }, {} /* data object */);
    });

};