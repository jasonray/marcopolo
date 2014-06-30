var express = require('express');
var app = express();

app.get('/ideas', function(req, res, next) {
	// get list of ideas for user
	// support pagination	
	res.send('list of ideas');
});

app.post('/ideas', function(req, res, next) {
	//add idea
});

app.post('/ideas/id/:id/vote', function(req, res, next) {
	// value = TRUE | FALSE
});

app.post('/ideas/id/:id/track', function(req, res, next) {
	// value = TRUE | FALSE
});

app.post('/ideas/id/:id/suspend', function(req,res,next) {
	// suspends an item
});

var port = 8888;
app.listen(port, function() {
	console.log('services now listening on %s', port);
});