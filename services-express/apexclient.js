var oracle = require("oracle");

exports.isHealthy = function(successHandler, errorHandler) {
	sql = "SELECT systimestamp FROM dual";
	runSqlHandleError(sql, function() {
		return successHandler();
	}, errorHandler);
};

// provide callback `function(results)` and `function(err)` for handling exceptions
function runSqlHandleError(sql, successHandler, errorHandler) {
	runSql(sql, function(err, results) {
		if (err) return errorHandler(err);
		else return successHandler(results);
	});
}

// provide callback `function(err, results)`
function runSql(sql, callback) {
	var connString = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=demos.agilex.com)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=XE)))";
	var connectData = {
		"tns": connString,
		"user": "th",
		"password": "th",
		"ConnectionTimeout": "1"
	};

	console.log('connecting to oracle');

	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log('XError connecting to db:', err);
			return callback(err);
		}

		console.log('execute oracle query [%s]', sql);
		connection.execute(sql, [], function(err, results) {
			if (err) {
				console.log('Error executing query [%s]', err);
				return callback(err);
			}

			console.log('complete executing oracle query');
			connection.close(); // call only when query is finished executing
			return callback(null, results);
		});
	});
}

exports.fetchIdeas = fetchIdeas = function(successHandler, errorHandler) {
	//update sql statement here
	var sql = '';
	runSqlHandleError(sql, successHandler, errorHandler);
};

// customize this if needed to convert from oracle response to transport
function convertFromDataToTransport(dataItem) {
	console.log('converting from data to transport for ' + dataItem);
	if (!dataItem) return dataItem;

	var transport = {};
	transport.id = dataItem.id;
	transport.short_description = dataItem.short_description;
	transport.long_description = dataItem.long_description;
	transport.comment_count = dataItem.comments.length;
	transport.created = dataItem.createDate;
	return transport;
}

exports.fetchIdea = fetchIdea = function(id) {
	// return single item by id
};

exports.fetchIdeaVoteResultForUser = fetchIdea = function(id, user) {
	// return true/false/null to indicate user's vote for this item
};

exports.voteYes = voteYes = function(id, user) {
	vote(id, user, true);
};
exports.voteNo = voteNo = function(id, user) {
	vote(id, user, false);
};

exports.vote = vote = function(id, user, rawVotingResult) {
	//ensure voting result parses
	var votingResult = stringToBoolean(rawVotingResult);
	// save voting result
};

exports.fetchTrackingValueForUser = fetchTrackingValueForUser = function(id, user) {
	// return true/false
};
exports.trackItem = trackItem = function(id, user) {
	setTrackItem(id, user, true);
};
exports.untrackItem = untrackItem = function(id, user) {
	setTrackItem(id, user, false);
};
exports.setTrackItem = setTrackItem = function(id, user, rawTrackValue) {
	var trackValue = stringToBoolean(rawTrackValue);
	// save tracking value for id/user
};

var stringToBoolean = function(string) {
	// todo: extract this
	if (typeof string === 'boolean') return string;

	switch (string.toLowerCase()) {
		case "true":
		case "yes":
		case "1":
			return true;
		case "false":
		case "no":
		case "0":
		case null:
			return false;
		default:
			return Boolean(string);
	}
};

exports.createIdea = createIdea = function(item) {
	// save and return newly created item with id filled in
};

exports.fetchComments = fetchComments = function(id) {
	// fetch list of comments
};
exports.saveComment = saveComment = function(id, user, comment) {
	// save comment:
	// commentEntry.id = uuid.v4();
	// commentEntry.comment = comment;
	// commentEntry.user = user;
	// commentEntry.created = new Date();
};

exports.suspendIdea = suspendIdea = function(id, user) {
	// save suspended value
};