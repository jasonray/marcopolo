var express = require('express');
var app = express();

app.get('/ideas', function(req, res, next) {
	res.send('list of ideas');
});

var port = 8888;
app.listen(port, function() {
	console.log('services now listening on %s', port);
});