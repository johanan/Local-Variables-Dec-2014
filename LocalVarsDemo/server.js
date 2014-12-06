var http = require('http'),
    SimpleApp = require('SimpleApp'),
    app = new SimpleApp();

var port = process.env.port || 1337;

//route functions
function test(req, res, next) {
    res.write('Hey this is a test!');
    res.end();
};

function log(req, res, next) {
    console.log(req.url);
    next();
};

function error(req, res, next) {
    next(new Error('This is an error!'));
};

function notFound(req, res, next) {
    res.statusCode = 404;
    res.write('Not Found');
    res.end();
};

function handleError(err, req, res, next) {
    console.log(err);
    res.statusCode = 500;
    res.write('There was an error');
    res.end();
};

//wiring up middleware
app.use(undefined, SimpleApp.powered);
app.use(undefined, log);
app.use(undefined, SimpleApp.staticFiles(__dirname + '/static/'));
app.use('/error', error);
app.use('/test', test);
app.use(undefined, notFound);
app.use(undefined, handleError);

//serving
var server = http.createServer();
server.on('request', app.handle);
server.listen(port);