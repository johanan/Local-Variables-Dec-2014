var http = require('http'),
    fs = require('fs');

var port = process.env.port || 1337;

var app = new SimpleApp();

app.use(undefined, staticFilesSetup(__dirname + '/static'));
app.use(undefined, function (req, res, next) {
    res.write('HEY from SimpleApp');
    res.end();
});

var server = http.createServer();
server.on('request', app.handle);
server.listen(port);

function SimpleApp() {
    mwStack = [];
    
    this.use = function (route, func) {
        mwStack.push({ route: route, func: func });
    };
    
    this.routeMatch = function routeMatch(route, url) {
        return route === undefined || route === url;
    };
    
    this.handle = function (req, res) {
        var index = 0,
            routeMatch = this.routeMatch;
        
        var next = function next(err) {
            var mw = mwStack[index]
            index++;
            
            if (mw === undefined) {
                return;
            }
            
            if (routeMatch(mw.route, req.url)) {
                if (mw.func.length === 3 && err === undefined)
                    mw.func.call(this, req, res, next);
                else if (mw.func.length === 4)
                    mw.func.call(this, err, req, res, next);
                else
                    next(err);
            } else {
                next(err);
            }
        };
        
        next();
    }.bind(this);
    
    return this;
};

function staticFilesSetup(serverPath) {
    
    return function staticFiles(req, res, next) {
        var path = serverPath + req.url;
        fs.stat(path, function (err, stats) {
            if (err)
                next();
            
            if (stats !== undefined && stats.isFile()) {
                res.writeHeader(200, {
                    'Content-Type': 'text/html',
                    'Content-Length': stats.size
                });
                var readStream = fs.createReadStream(path);
                readStream.pipe(res);
            } else {
                next();
            }
        });
    };
};