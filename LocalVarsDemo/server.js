var http = require('http');
var port = process.env.port || 1337;

var server = http.createServer();
server.listen(port);

server.on('request', function (request, response) {
    response.write('HEY!');
    response.end();
});