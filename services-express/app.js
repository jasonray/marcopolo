var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var dataAdapter = require('./sampleDataAdapter');
var apexClient = require('./apexclient');

function errorHandler(res) {
	return function(err) {
		console.log('error handler firing');
		var util = require('util');
		res.send(500, err.message);
	};
}

function onSuccessReturnResults(res) {
	return function(results) {
		console.log('success handler firing');
		res.send(results);
	};
}


app.get('/health', function(req, res, next) {
	console.log('checking isHealthy');
	apexClient.isHealthy(function() {
		res.send(200, 'healthy');
	}, errorHandler(res));
});

app.get('/ideas', function(req, res, next) {
	apexClient.fetchIdeas(onSuccessReturnResults(res), errorHandler(res));
	console.log('past /ideas request');
});

app.get('/ideas/id/:id', function(req, res, next) {
	var id = req.param('id');
	apexClient.fetchIdea(id, onSuccessReturnResults(res), errorHandler(res));
});

app.use('/ideas', bodyParser.json({
	strict: true
}));
app.post('/ideas', function(req, res, next) {
	var newIdea = req.body;
	console.log('received request to create new idea [%s][%s]', newIdea, newIdea.short_description);

	var util = require('util');
	console.log(util.inspect(req.body, {
		showHidden: true,
		depth: null
	}));

	var idea = dataAdapter.createIdea(newIdea);
	// i am returning the version from the data adapter to ensure that the links get built, there are better ways to accomplish this
	var result = dataAdapter.fetchIdea(idea.id);
	res.send(result);
});

//// a couple of different ways to model voting
//// please forgive the redundency!
//// i like "PUT /ideas/id/:id/votingResult" for rest considerations
//// but i like "POST /ideas/id/:id/operations/voteYes" for simplicity
app.get('/ideas/id/:id/votingResult', function(req, res, next) {
	res.send(dataAdapter.fetchIdeaVoteResultForUser(req.param('id'), determineUser(req)));
});
app.use('/ideas/id/:id/votingResult', bodyParser.text({
	limit: '1kb'
}));
app.put('/ideas/id/:id/votingResult', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	var votingResult = req.body;
	console.log('voting [%s][%s][%s]', id, user, votingResult);
	dataAdapter.vote(id, user, votingResult);
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

// tracking
app.get('/ideas/id/:id/tracking', function(req, res, next) {
	res.send(dataAdapter.fetchTrackingValueForUser(req.param('id'), determineUser(req)));
});
app.use('/ideas/id/:id/tracking', bodyParser.text({
	limit: '1kb'
}));
app.put('/ideas/id/:id/tracking', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	var trackingValue = req.body;
	console.log('tracking [%s][%s][%s]', id, user, trackingValue);
	dataAdapter.setTrackItem(id, user, votingResult);
	res.send(200);
});
app.post('/ideas/id/:id/operations/track', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	console.log('track item [%s][%s]', id, user);
	dataAdapter.trackItem(id, user);
	res.send(200);
});
app.post('/ideas/id/:id/operations/untrack', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	console.log('untrack item [%s][%s]', id, user);
	dataAdapter.untrackItem(id, user);
	res.send(200);
});

app.get('/ideas/id/:id/comments', function(req, res, next) {
	var id = req.param('id');
	console.log('fetch comments [%s][%s]', id);
	var comments = dataAdapter.fetchComments(id);
	res.send(comments);
});
app.use('/ideas/id/:id/comments', bodyParser.text({
	limit: '1kb'
}));
app.post('/ideas/id/:id/comments', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	var commentText = req.body;
	console.log('storing comment [%s][%s][%s]', id, user, commentText);
	dataAdapter.saveComment(id, user, commentText);
	res.send(200);
});

app.post('/ideas/id/:id/operations/suspend', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	console.log('suspend item [%s][%s]', id, user);
	dataAdapter.suspendIdea(id, user);
	res.send(200);
});

function determineUser(req) {
	return req.param('user');
}

var port = 9998;
app.listen(port, function() {
	console.log('services now listening on %s', port);
});