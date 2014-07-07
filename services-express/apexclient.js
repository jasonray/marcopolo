var oracle = require("oracle");
var _ = require('underscore');

exports.isHealthy = function(successHandler, errorHandler) {
	sql = "SELECT systimestamp FROM dual";
	runSqlHandleError(sql, function() {
		return successHandler();
	}, errorHandler);
};

// provide callback `function(results)` and `function(err)` for handling exceptions
function runSqlHandleError(sql, successHandler, errorHandler) {
	runSql(sql, function(err, results) {
		console.log('firing runSqlHandleError handler');
		console.log('err [%s]', err);
		console.log('results [%s]', results);
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

exports.fetchTopics = fetchTopics = function(successHandler, errorHandler) {

	var lowerRowCount = 1;
	var upperRowCount = 10;

	var sql = "select * " +
                  "  from ( select rownum rnum, a.* " +
                  "           from ( select t.id, t.title, t.description, t.created, c.comment_count, i.idea_count, " +
                  "                         decode(u.first_name || ' ' || u.last_name, ' ', u.username, " +
                  "                                u.first_name || ' ' || u.last_name) owner, t.closed, " +
                  "                         t.revoked, s.suspension_count, t.owner owner_username, rownum rn " +
                  "                    from topics t, users u, " +
                  "                         (select count(*) comment_count, parent_id " +
                  "                            from comments " +
                  "                           where parent_type = 'topic' " +
                  "                           group by parent_id) c, " +
                  "                         (select count(*) idea_count, topic_id " +
                  "                            from ideas " +
                  "                           group by topic_id) i, " +
                  "                         (select count(*) suspension_count, parent_id " +
                  "                            from suspension_requests " +
                  "                           where parent_type = 'topic' " +
                  "                           group by parent_id) s " +
                  "                   where t.owner = u.username " +
                  "                     and t.id = c.parent_id (+) " +
                  "                     and t.id = i.topic_id (+) " +
                  "                     and t.id = s.parent_id (+) ) a " +
                  "           where rownum <= " + upperRowCount + " ) " +
                  " where rnum >= " + lowerRowCount;


	// this is going to run a sql statement, and on success
	// of oracle client it will run the function(data)
	// that function will parse data to "transport model"
	// and then hand back to the "successHandler"
	// passed in from app.js, which just perfroms result.send(transportdata);
	runSqlHandleError(sql, function(data) {
		var resultData = [];
		_.each(data, function(rawItem) {
			var resultItem = convertFromDataToTransport(rawItem);
			resultData.push(resultItem);
		});
		successHandler(resultData);
	}, errorHandler);
	console.log('past fetchTopics.runSqlHandleError');
};

exports.fetchIdeas = fetchIdeas = function(successHandler, errorHandler) {
	//update sql statement here
	var lowerRowCount = 1;
	var upperRowCount = 10;
	var sql = 
          "select *  " +
          "  from ( select rownum rnum, a.* " +
          "           from ( select x.id, x.short_desc, x.description, x.created, " +
          "                         x.comment_count, x.tags, x.rn " +
          "                    from (select i.id, i.short_desc, i.description, i.created, " +
          "                                 c.comment_count, rownum rn, t.tags   " +
          "                            from ideas i, " +
          "                                 (select count(*) comment_count, parent_id " +
          "                                    from comments " +
          "                                   where parent_type = 'idea' " +
          "                                   group by parent_id) c, " +
          "                                 (select it.idea_id,  " +
          "                                         listagg(it.tag, ' ') within group (order by it.tag) tags " +
          "                                    from idea_tags it " +
          "                                   group by it.idea_id) t " +
          "                           where c.parent_id(+) = i.id " +
          "                             and i.id = t.idea_id(+) ) x ) a  " +
          "          where rownum <= " + upperRowCount + " ) " +
          " where rnum >= " + lowerRowCount;


	// this is going to run a sql statement, and on success
	// of oracle client it will run the function(data)
	// that function will parse data to "transport model"
	// and then hand back to the "successHandler"
	// passed in from app.js, which just perfroms result.send(transportdata);
	runSqlHandleError(sql, function(data) {
		var resultData = [];
		_.each(data, function(rawItem) {
			var resultItem = convertFromDataToTransport(rawItem);
			resultData.push(resultItem);
		});
		successHandler(resultData);
	}, errorHandler);
	console.log('past fetchIdeas.runSqlHandleError');
};

// customize this if needed to convert from oracle response to transport
function convertFromDataToTransport(dataItem) {

	console.log('converting from data to transport for ' + dataItem);
	if (!dataItem) return dataItem;

	var transport = {};
	transport.id = dataItem.ID;
	transport.owner = dataItem.OWNER;
	transport.created = new Date(dataItem.CREATED);
	transport.title = dataItem.TITLE;
	transport.short_description = dataItem.SHORT_DESC;
	transport.description = dataItem.DESCRIPTION;
	transport.tags = dataItem.TAGS;
	transport.idea_count = dataItem.IDEA_COUNT;
	transport.comment_count = dataItem.COMMENT_COUNT;
	transport.upvotes = dataItem.UPVOTES;
	transport.downvotes = dataItem.DOWNVOTES;
	return transport;
}

exports.fetchIdea = fetchIdea = function(id, successHandler, errorHandler) {

	var sql = "select i.id, decode(u.first_name || ' ' || u.last_name, ' ', i.owner, " +
                  "                    u.first_name || ' ' || u.last_name) owner, " +
                  "       i.short_desc short_desc, i.description, " +
                  "       i.created, c.comment_count, t.tags, " +
                  "       nvl(v.upvotes, 0) upvotes, nvl(v2.downvotes, 0) downvotes " +
                  "  from ideas i, users u, " +
                  "       (select count(*) comment_count, parent_id  " +
                  "          from comments " +
                  "         where parent_type = 'idea' " +
                  "         group by parent_id) c, " +
                  "       (select it.idea_id,  " +
                  "               listagg(it.tag, ' ') within group (order by it.tag) tags " +
                  "          from idea_tags it " +
                  "         group by it.idea_id) t, " +
                  "       (select nvl(count(*),0) upvotes, idea_id " +
                  "          from votes " +
                  "         where vote = 'yes' " +
                  "         group by idea_id) v, " +
                  "       (select nvl(count(*),0) downvotes, idea_id " +
                  "          from votes " +
                  "         where vote = 'no' " +
                  "         group by idea_id) v2 " +
                  " where i.owner = u.username " +
                  "   and i.id = c.parent_id (+) " +
                  "   and i.id = t.idea_id (+) " +
                  "   and i.id = v.idea_id (+) " +
                  "   and i.id = v2.idea_id (+) " +
                  "   and i.id = " + id;

	runSqlHandleError(sql, function(data) {
		console.log('found %s record(s)',data.length);
		if (data.length === 0) successHandler(undefined);
		var resultItem = convertFromDataToTransport(data[0]);
		successHandler(resultItem);
	}, errorHandler);
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
