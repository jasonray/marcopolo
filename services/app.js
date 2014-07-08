var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');

var dataAdapter = require('./sampleDataAdapter');
var apexClient = require('./apexclient');

var logger = require('bunyan').createLogger({
	name: "apexclient"
});


function errorHandler(res) {
	return function(err) {
		console.log('error handler firing');
		var util = require('util');
		res.send(500, err.message);
	};
}

function onSuccessReturnResults(res) {
	return function(results) {
		res.send(results);
	};
}

app.use(function(req, res, next) {
	console.log('request: %s %s', req.method, req.url);
	next();
});

app.use(express.static('client/app'));

app.get('/health', function(req, res, next) {
	console.log('checking isHealthy');
	apexClient.isHealthy(function() {
		res.send(200, 'healthy');
	}, errorHandler(res));
});

app.get('/topics', function(req, res, next) {
	apexClient.fetchTopics(onSuccessReturnResults(res), errorHandler(res));
});


app.get('/topic/id/:id', function(req, res, next) {
	apexClient.fetchTopic(req.param('id'), onSuccessReturnResults(res), errorHandler(res));
});


app.use(cors());

app.get('/ideas', function(req, res, next) {
	apexClient.fetchIdeas(onSuccessReturnResults(res), errorHandler(res));
});

app.get('/ideas/id/:id', function(req, res, next) {
	apexClient.fetchIdea(req.param('id'), onSuccessReturnResults(res), errorHandler(res));
});

app.use('/ideas', bodyParser.json({
	strict: true
}));

app.post('/ideas', function(req, res, next) {
	var newIdea = req.body;
	var user = determineUser(req);

	console.log('received request to create new idea');
	console.dir(newIdea);

	apexClient.createIdea(newIdea, user, onSuccessReturnResults(res), errorHandler(res));
});

//// a couple of different ways to model voting
//// please forgive the redundency!
//// i like "PUT /ideas/id/:id/votingResult" for rest considerations
//// but i like "POST /ideas/id/:id/operations/voteYes" for simplicity
app.get('/ideas/id/:id/votingResult', function(req, res, next) {
	apexClient.fetchVotingResult(id, user, onSuccessReturnResults(res), errorHandler(res));
});
app.use('/ideas/id/:id/votingResult', bodyParser.text({
	limit: '1kb'
}));
app.put('/ideas/id/:id/votingResult', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	var votingResult = req.body;
	apexClient.vote(id, user, onSuccessReturnResults(res), errorHandler(res));
});
app.post('/ideas/id/:id/operations/voteYes', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	apexClient.voteYes(id, user, onSuccessReturnResults(res), errorHandler(res));
});
app.post('/ideas/id/:id/operations/voteNo', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	apexClient.voteNo(id, user, onSuccessReturnResults(res), errorHandler(res));
});

// tracking
app.get('/ideas/id/:id/tracking', function(req, res, next) {
	apexClient.method(req.param('id'), determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});
app.use('/ideas/id/:id/tracking', bodyParser.text({
	limit: '1kb'
}));
app.post('/ideas/id/:id/operations/track', function(req, res, next) {
	apexClient.trackItem(req.param('id'), determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});
app.post('/ideas/id/:id/operations/untrack', function(req, res, next) {
	apexClient.untrackItem(req.param('id'), determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});

app.get('/ideas/id/:id/comments', function(req, res, next) {
	var id = req.param('id');
	apexClient.method(id, onSuccessReturnResults(res), errorHandler(res));
});
app.use('/ideas/id/:id/comments', bodyParser.text({
	limit: '1kb'
}));
app.post('/ideas/id/:id/comments', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	var commentText = req.body;
	apexClient.saveComment(id, user, commentText, onSuccessReturnResults(res), errorHandler(res));
});

app.post('/ideas/id/:id/operations/suspend', function(req, res, next) {
	var id = req.param('id');
	var user = determineUser(req);
	apexClient.suspendIdea(id, user, onSuccessReturnResults(res), errorHandler(res));
});

function determineUser(req) {
	return req.param('user');
}

var port = 9998;
app.listen(port, function() {
	console.log('services now listening on %s', port);
});