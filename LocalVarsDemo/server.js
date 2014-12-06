var express = require('express'),
    app = express();
var port = process.env.port || 1337;

//serve static assets
app.use(express.static(__dirname + '/static'));

//map functions to routes
app.get('/express', function (req, res) {
    res.send('Hey from Express!')
});

var server = app.listen(port);