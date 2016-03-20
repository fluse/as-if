module.exports = function (app) {

    app.get('/', (req, res) => {

        res.renderPage({
            page: 'juke'
        }, {
            albums: []
        });

        app.navigation.getButtons();
        app.scanner.getList();
    });

};
