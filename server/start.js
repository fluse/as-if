process.env.TZ = 'Europe/Amsterdam';

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    compression = require('compression'),
    // get application config
    app = require('./../config/')(app),
    Juke = require('./juke/');

app.io = io;
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
}));

app.use(bodyParser.json({limit: '50mb'}));

app.use(compression());

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: app.config.layout.defaultTemplate,
    layoutsDir: 'client/templates/layouts/',
    extname: '.hbs',
    partialsDir: [
        'client/templates/components/'
    ],
    helpers: require('./../client/templates/helper')
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'client/templates/');

// Static Routes
app.use('/public', express.static('public'));
// Static Routes
app.use('/cover', express.static('public/cover'));

// Static Routes
app.use('/media', express.static('media'));

app.juke = new Juke(app);

// get routes
require('./routes/')(app);

server.listen(app.config.request.environment.port);

console.log('jukebox listen on port %s', app.config.request.environment.port);
