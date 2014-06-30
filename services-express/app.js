var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var dataAdapter = require('./sampleDataAdapter');

app.use(bodyParser.text({
	limit: '100kb'
}));

app.get('/ideas', function(req, res, next) {
	res.send(dataAdapter.fetchIdeas());
});

app.get('/ideas/id/:id', function(req, res, next) {
	var id = req.param('id');
	console.log('fetch by id [%s]', id);
	var result = dataAdapter.fetchIdea(id);
	if (result) {
		res.send(result);
	} else {
		console.log('unable to fetch by id [%s]', id);
		res.send(404);
	}
});

app.post('/ideas', function(req, res, next) {
	//add idea
});

//// a couple of different ways to model voting
//// please forgive the redundency!
//// i like "PUT /ideas/id/:id/votingResult" for rest considerations
//// but i like "POST /ideas/id/:id/operations/voteYes" for simplicity
app.get('/ideas/id/:id/votingResult', function(req, res, next) {
	res.send(dataAdapter.fetchIdeaVoteResultForUser(req.param('id'), determineUser(req)));
});
app.put('/ideas/id/:id/votingResult', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	var votingResult = req.body;
	console.log('voting [%s][%s][%s]', id, user, votingResult);
	dataAdapter.vote(id,user,votingResult);
	res.send(200);
});
app.post('/ideas/id/:id/operations/voteYes', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	console.log('vote by id [%s][%s]', id, user);
	dataAdapter.voteYes(id, user);
	res.send(200);
});
app.post('/ideas/id/:id/operations/voteNo', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	console.log('vote by id [%s][%s]', id, user);
	dataAdapter.voteNo(id, user);
	res.send(200);
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

function determineUser(req) {
	return req.param('user');
}

var port = 8888;
app.listen(port, function() {
	console.log('services now listening on %s', port);
});