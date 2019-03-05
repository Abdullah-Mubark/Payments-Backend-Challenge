//Dependencies
var compression = require('compression');
var express = require('express');
var bp = require('body-parser');
var utils = require('./scripts/util/commonUtils');
var session = require('express-session');
var http = require('http');
var gatewayController = require('./controllers/gateway');

var masterpassController = require('./controllers/masterpass');

var SecureController = require('./controllers/3DSecure');
var hostedCheckoutController = require('./controllers/hostedCheckout');
var payThroughNVPController = require('./controllers/payThroughNVP');
var indexController = require('./controllers/index');
var appPortNo = '5000';
//Express
var app = express();
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(function (request, response, next) {
    request.session.cookie = {};
    next()
});
// compress all requests
app.use(compression());
app.use(bp.urlencoded({
    extended: true
}));
app.use(bp.json());
if(!process.env.PORT){
    process.env.PORT = appPortNo;
}
app.set('port', process.env.PORT);
//Routes
app.use('/process', gatewayController);
app.use('/', indexController);

app.use('/process', masterpassController);

app.use('/process', SecureController);
app.use('/process', hostedCheckoutController);
app.use('/process', payThroughNVPController);
app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/public');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.get('/', function (request, response, next) {
    response.redirect('/pay');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('gateway NodeJS sample code running on port', app.get('port'));
    utils.initWebhooksNotificationsFolder();
});
