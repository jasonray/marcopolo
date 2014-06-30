var express = require('express');
var app = express();

var dataAdapter = require('./sampleDataAdapter');

app.get('/ideas', function(req, res, next) {
	res.send(dataAdapter.fetchIdeas());
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

app.post('/ideas/id/:id/suspend', function(req, res, next) {
	// suspends an item
});

app.post('/ideas/id/:id/comments', function(req, res, next) {
	// get comments for an idea
});

var port = 8888;
app.listen(port, function() {
	console.log('services now listening on %s', port);
});