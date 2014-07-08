var oracle = require("oracle");
var _ = require('underscore');

exports.isHealthy = function(successHandler, errorHandler) {
	sql = "SELECT systimestamp FROM dual";
	runSqlHandleError(sql, function() {
		return successHandler();
	}, errorHandler);
};

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
};

exports.fetchTopic = fetchTopic = function(id, successHandler, errorHandler) {
	var sql = "select t.id, decode(u.first_name || ' ' || u.last_name, ' ', t.owner, " +
		"                u.first_name || ' ' || u.last_name) owner, " +
		"       t.title title, t.description, " +
		"       t.created, c.comment_count, tt.tags " +
		"  from topics t, users u, " +
		"       (select count(*) comment_count, parent_id  " +
		"          from comments " +
		"         where parent_type = 'topic' " +
		"         group by parent_id) c, " +
		"       (select tt.topic_id,  " +
		"               listagg(tt.tag, ' ') within group (order by tt.tag) tags " +
		"          from topic_tags tt " +
		"         group by tt.topic_id) tt " +
		" where t.owner = u.username " +
		"   and t.id = c.parent_id (+) " +
		"   and t.id = tt.topic_id (+) " +
		"   and t.id = " + id;

	runSqlHandleError(sql, function(data) {
		console.log('found %s record(s)', data.length);
		if (data.length === 0) successHandler(undefined);
		var resultItem = convertFromDataToTransport(data[0]);
		successHandler(resultItem);
	}, errorHandler);
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
};

// customize this if needed to convert from oracle response to transport
function convertFromDataToTransport(dataItem) {

	if (!dataItem) return dataItem;

	var transport = {};
	transport.id = dataItem.ID;
	transport.owner = dataItem.OWNER;
	transport.created = new Date(dataItem.CREATED);
	transport.revoked = new Date(dataItem.REVOKED);
	transport.suspended = new Date(dataItem.SUSPENDED);
	transport.closed = new Date(dataItem.CLOSED);
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
		console.log('found %s record(s)', data.length);
		if (data.length === 0) successHandler(undefined);
		var resultItem = convertFromDataToTransport(data[0]);
		successHandler(resultItem);
	}, errorHandler);
};

exports.fetchIdeaVoteResultForUser = fetchIdea = function(id, user) {
	// return true/false/null to indicate user's vote for this item
};

exports.voteYes = voteYes = function(id, user, successHandler, errorHandler) {
	vote(id, user, true, successHandler, errorHandler);
};
exports.voteNo = voteNo = function(id, user, successHandler, errorHandler) {
	vote(id, user, false, successHandler, errorHandler);
};

exports.vote = vote = function(id, user, rawVotingResult, successHandler, errorHandler) {
	//ensure voting result parses
	var votingResult = stringToYesNo(rawVotingResult);
	// save voting result

	console.log('this is where apex client would set [id=%s][user=%s]=>[%s]', id, user, votingResult);
	console.log('successHandler => %s', successHandler);
	console.log('errorHandler => %s', errorHandler);
	// var sql = "call th_ideas_pkg.vote_on_idea(110,'dillons’,'yes')";
	var sql = "call th_ideas_pkg.vote_on_idea(:1,:2,:3)";
	var params = [id, user, votingResult];

	runSqlWithParametersHandleError(sql, params, successHandler, errorHandler);

	// runSqlHandleError(sql, function(data) {
	// 	console.log('found %s record(s)', data.length);
	// 	if (data.length === 0) successHandler(undefined);
	// 	var resultItem = convertFromDataToTransport(data[0]);
	// 	successHandler(resultItem);
	// }, errorHandler);

};

exports.fetchTrackingValueForUser = fetchTrackingValueForUser = function(id, user, successHandler, errorHandler) {
	// return true/false
};
exports.trackItem = trackItem = function(id, user, successHandler, errorHandler) {
	var sql = "th_ideas_pkg.track_an_idea(:1,:2)";
	var params = (id, user);

	runSqlWithParametersHandleError(sql, params, successHandler, errorHandler);
};
exports.untrackItem = untrackItem = function(id, user, successHandler, errorHandler) {
	var sql = "th_ideas_pkg.untrack_an_idea(:1,:2)";
	var params = (id, user);

	runSqlWithParametersHandleError(sql, params, successHandler, errorHandler);
};

var stringToYesNo = function(string) {
	if (string === true) return "yes";
	if (string === false) return "no";

	switch (string.toLowerCase()) {
		case "true":
		case "yes":
		case "1":
			return "yes";
		case "false":
		case "no":
		case "0":
		case null:
			return "no";
		default:
			return "no";
	}
};

exports.createIdea = createIdea = function(item, user, successHandler, errorHandler) {

	// th_ideas_pkg.create_idea(
	//   3         p_short_desc  => 'Hey I have an idea!',
	//   4         p_owner       => 'dillons',
	//   5         p_description => 'More descriptive text',
	//   6         p_topic_id    => null,
	//   7         p_tags        => '#onetag #twotag #threetag #four');

	var sql = "call th_ideas_pkg.create_idea(:1,:2,:3,:4,:5)";
	var params = [item.short_description, 'dillons', item.long_description, null, '#testdata'];
	runSqlWithParametersHandleError(sql, params, successHandler, errorHandler);
};

exports.fetchComments = fetchComments = function(id, successHandler, errorHandler) {
	var sql = "select comments ..."; //TODO
	var params = [];

	runSqlWithParametersHandleError(sql, params, successHandler, errorHandler);
};

exports.saveComment = saveComment = function(id, user, comment, successHandler, errorHandler) {
	var sql = "procedure name(:1,:2,:3)"; //TODO
	var params = [id,user,comment];

	runSqlWithParametersHandleError(sql, params, successHandler, errorHandler);
};

exports.suspendIdea = suspendIdea = function(id, user) {
	// save suspended value
};


function runSqlHandleError(sql, successHandler, errorHandler) {
	runSqlWithParametersHandleError(sql, [], successHandler, errorHandler);
}

function runSqlWithParametersHandleError(sql, params, successHandler, errorHandler) {
	runSqlWithParameters(sql, params, function(err, results) {
		if (err) return errorHandler(err);
		else return successHandler(results);
	});
}

function runSqlWithParameters(sql, params, callback) {
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
			console.log('Error connecting to db:', err);
			return callback(err);
		}
		console.log('execute sql [%s][%s]', sql, params);
		connection.execute(sql, params, function(err, results) {
			if (err) {
				console.log('Error executing sql [%s]', err);
				return callback(err);
			}

			console.log('complete executing sql');
			connection.close(); // call only when query is finished executing
			return callback(null, results);
		});
	});
}