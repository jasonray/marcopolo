var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');

var apexClient = require('./apexclient');

var logger = require('bunyan').createLogger({
	name: "resource"
});

function errorHandler(res) {
	return function(err) {
		logger.warn('firing resource error handler');
		console.dir(err);
		res.send(500, err.message);
	};
}

function onSuccessReturnResults(res) {
	return function(results) {
		res.send(results);
	};
}

app.use(function(req, res, next) {
	logger.info('request: %s %s', req.method, req.url);
	next();
});

app.use(express.static('client/app'));

app.get('/health', function(req, res, next) {
	logger.info('checking isHealthy');
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

app.get('/ideas/new', function(req, res, next) {
	apexClient.newIdeasFeed(determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});
app.get('/ideas/tracked', function(req, res, next) {
	apexClient.trackedIdeasFeed(determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});
app.get('/ideas/mine', function(req, res, next) {
	apexClient.myItemsFeed(determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});
app.get('/ideas/past', function(req, res, next) {
	apexClient.pastItemsFeed(determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});
app.get('/ideas/ignored', function(req, res, next) {
	apexClient.ignoredIdeasFeed(determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});

app.get('/ideas/id/:id', function(req, res, next) {
	apexClient.fetchIdea(req.param('id'), onSuccessReturnResults(res), errorHandler(res));
});

app.use('/ideas', bodyParser.json({
	strict: true
}));

app.post('/login', function(req, res, next) {
	apexClient.loginUser(determineUser(req), req.param('pw'), onSuccessReturnResults(res), errorHandler(res));
});

app.post('/ideas', function(req, res, next) {
	apexClient.createIdea(req.body, determineUser(req), onSuccessReturnResults(res), errorHandler(res));
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
	apexClient.vote(req.param('id'), determineUser(req),req.body, onSuccessReturnResults(res), errorHandler(res));
});
app.post('/ideas/id/:id/operations/voteYes', function(req, res, next) {
	apexClient.voteYes(req.param('id'), determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});
app.post('/ideas/id/:id/operations/voteNo', function(req, res, next) {
	apexClient.voteNo(req.param('id'), determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});

// tracking
app.get('/ideas/id/:id/tracking', function(req, res, next) {
	apexClient.method(req.param('id'), determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});
app.post('/ideas/id/:id/operations/track', function(req, res, next) {
	apexClient.trackItem(req.param('id'), determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});
app.post('/ideas/id/:id/operations/untrack', function(req, res, next) {
	apexClient.untrackItem(req.param('id'), determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});

app.get('/ideas/id/:id/comments', function(req, res, next) {
	apexClient.method(req.param('id'), onSuccessReturnResults(res), errorHandler(res));
});
app.use('/ideas/id/:id/comments', bodyParser.text({
	limit: '1kb'
}));
app.post('/ideas/id/:id/comments', function(req, res, next) {
	apexClient.saveComment(req.param('id'), determineUser(req), req.body, onSuccessReturnResults(res), errorHandler(res));
});

app.post('/ideas/id/:id/operations/suspend', function(req, res, next) {
	apexClient.suspendIdea(req.param('id'), determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});

app.post('/ideas/id/:id/operations/ignore', function(req, res, next) {
	apexClient.ignoreIdea(req.param('id'), determineUser(req), onSuccessReturnResults(res), errorHandler(res));
});

function determineUser(req) {
	return req.param('user');
}

var port = 9998;
app.listen(port, function() {
	logger.info('services now listening on %s', port);
});
