var express = require('express');
var app = express();

app.get('/', function(req, res, next) {
	res.send('hello world');
});

var port = 8888;
app.listen(port, function() {
	console.log('services now listening on %s', port);
});