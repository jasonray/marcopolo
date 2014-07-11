var oracle = require("oracle");
var _ = require('underscore');
var logger = require('bunyan').createLogger({
	name: "apexclient"
});

exports.isHealthy = function(successHandler, errorHandler) {
	sql = "SELECT systimestamp FROM dual";
	runSql(sql, [], successHandler, errorHandler);
};

exports.fetchTopics = fetchTopics = function(successHandler, errorHandler) {
	logger.info('apexClient.fetchTopics');

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
	runSql(sql, [], function(data) {
		var resultData = [];
		_.each(data, function(rawItem) {
			var resultItem = convertFromDataToTransport(rawItem);
			resultData.push(resultItem);
		});
		successHandler(resultData);
	}, errorHandler);
};

exports.fetchTopic = fetchTopic = function(id, successHandler, errorHandler) {
	logger.info('apexClient.fetchTopic(%s)', id);

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

	runSql(sql, [], function(data) {
		logger.debug('found %s record(s)', data.length);
		if (data.length === 0) successHandler(undefined);
		var resultItem = convertFromDataToTransport(data[0]);
		successHandler(resultItem);
	}, errorHandler);
};

// DEPRECATED!!!
exports.fetchIdeas = fetchIdeas = function(successHandler, errorHandler) {
	logger.info('apexClient.fetchIdeas');
	var lowerRowCount = 1;
	var upperRowCount = 25;
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

	ideaFeed(sql, [], successHandler, errorHandler);
};

// I assume we DO NOT need to see my vote, my tracking status for NEW ideas?
exports.newIdeasFeed = newIdeasFeed = function(user, successHandler, errorHandler) {
	logger.info('apexClient.newIdeasFeed(%s)', user);
	var lowerRowCount = 1;
	var upperRowCount = 25;
	var sql =
		"select * " +
		"  from ( select rownum rnum, a.* " +
		"           from ( select x.id, x.owner, x.topic_id, x.topic_title, x.short_desc, x.description, " +
		"                         x.created, x.comment_count, x.tags, x.rn " +
		"                    from (select i.id, i.owner, t.id topic_id, t.title topic_title, i.short_desc, " +
		"                                 i.description, i.created, c.comment_count, rownum rn, t.tags " +
		"                            from ideas i, topics t, " +
		"                                 (select count(*) comment_count, parent_id " +
		"                                    from comments " +
		"                                   where parent_type = 'idea' " +
		"                                   group by parent_id) c, " +
		"                                 (select it.idea_id, " +
		"                                         listagg(it.tag, ' ') within group (order by it.tag) tags " +
		"                                    from idea_tags it " +
		"                                   group by it.idea_id) t " +
		"                           where i.topic_id = t.id(+) " +
		"                             and c.parent_id(+) = i.id " +
		"                             and i.id = t.idea_id(+) ) x ) a " +
		"          where rownum <= " + upperRowCount + " ) " +
		" where rnum >= " + lowerRowCount +
		"   and id not in (select distinct idea_id from votes where voter = '" + user + "' union all " +
		"                  select idea_id from ignored_ideas where ignoring_user = '" + user + "')";

	ideaFeed(sql, [], successHandler, errorHandler);
};

exports.searchIdeas = searchIdeas = function(user, search, successHandler, errorHandler) {
	logger.info('apexClient.searchIdeas(%s,%s)', user, search);
	var lowerRowCount = 1;
	var upperRowCount = 25;
	var sql =
		"select * " +
		"  from ( select rownum rnum, a.* " +
		"           from ( select x.id, x.owner, x.topic_id, x.topic_title, x.short_desc, x.description, " +
		"                         x.created, x.comment_count, x.tags, x.rn " +
		"                    from (select i.id, i.owner, t.id topic_id, t.title topic_title, i.short_desc, " +
		"                                 i.description, i.created, c.comment_count, rownum rn, t.tags " +
		"                            from ideas i, topics t, " +
		"                                 (select count(*) comment_count, parent_id " +
		"                                    from comments " +
		"                                   where parent_type = 'idea' " +
		"                                   group by parent_id) c, " +
		"                                 (select it.idea_id, " +
		"                                         listagg(it.tag, ' ') within group (order by it.tag) tags " +
		"                                    from idea_tags it " +
		"                                   group by it.idea_id) t " +
		"                           where i.topic_id = t.id(+) " +
		"                             and c.parent_id(+) = i.id " +
		"                             and i.id = t.idea_id(+) " +
		"                             and ( contains (i.short_desc, th_parser.simpleSearch('" + search + "')) > 0 " +
		"                                or contains (i.description, th_parser.simpleSearch('" + search + "')) > 0 ) ) x ) a " +
		"          where rownum <= " + upperRowCount + " ) " +
		" where rnum >= " + lowerRowCount +
		"   and id not in (select distinct idea_id from votes where voter = '" + user + "' union all " +
		"                  select idea_id from ignored_ideas where ignoring_user = '" + user + "') "; 

	ideaFeed(sql, [], successHandler, errorHandler);
};

exports.trackedIdeasFeed = trackedIdeasFeed = function(user, successHandler, errorHandler) {
	logger.info('apexClient.trackedIdeasFeed(%s)', user);
	var lowerRowCount = 1;
	var upperRowCount = 25;
	var sql =
		"select * " +
		"  from ( select rownum rnum, a.* " +
		"           from ( select x.id, x.owner, x.topic_id, x.topic_title, x.short_desc, x.description, " +
		"                         x.created, x.comment_count, x.tags, x.vote, x.rn " +
		"                    from (select i.id, i.owner, t.id topic_id, t.title topic_title, i.short_desc, " +
		"                                 i.description, i.created, c.comment_count, rownum rn, t.tags, " +
		"                                 v.vote  " +
		"                            from ideas i, topics t, tracked_ideas ti, votes v, " +
		"                                 (select count(*) comment_count, parent_id " +
		"                                    from comments " +
		"                                   where parent_type = 'idea' " +
		"                                   group by parent_id) c, " +
		"                                 (select it.idea_id, " +
		"                                         listagg(it.tag, ' ') within group (order by it.tag) tags " +
		"                                    from idea_tags it " +
		"                                   group by it.idea_id) t " +
		"                           where i.topic_id = t.id(+) " +
		"                             and c.parent_id(+) = i.id " +
		"                             and i.id = t.idea_id(+) " +
		"                             and i.id = ti.idea_id " +
		"                             and v.voter(+) = '" + user + "' " +
		"                             and i.id = v.idea_id (+) " +
		"                             and ti.tracking_user = '" + user + "' ) x ) a " +
		"          where rownum <= " + upperRowCount + " ) " +
		" where rnum >= " + lowerRowCount;

	ideaFeed(sql, [], successHandler, errorHandler);
};

exports.myItemsFeed = myItemsFeed = function(user, successHandler, errorHandler) {
	logger.info('apexClient.myItemsFeed(%s)', user);
	var lowerRowCount = 1;
	var upperRowCount = 25;
	var sql =
		"select * " +
		"  from ( select rownum rnum, a.* " +
		"           from ( select x.id, x.owner, x.topic_id, x.topic_title, x.short_desc, x.description, " +
		"                         x.created, x.comment_count, x.tags, x.vote, x.tracked, x.rn " +
		"                    from (select i.id, i.owner, t.id topic_id, t.title topic_title, i.short_desc, " +
		"                                 i.description, i.created, c.comment_count, rownum rn, t.tags, " +
		"                                 decode(ti.tracked,null,'no','yes') tracked, v.vote " +
		"                            from ideas i, topics t, tracked_ideas ti, votes v, " +
		"                                 (select count(*) comment_count, parent_id " +
		"                                    from comments " +
		"                                   where parent_type = 'idea' " +
		"                                   group by parent_id) c, " +
		"                                 (select it.idea_id, " +
		"                                         listagg(it.tag, ' ') within group (order by it.tag) tags " +
		"                                    from idea_tags it " +
		"                                   group by it.idea_id) t " +
		"                           where i.owner = '" + user + "' " +
		"                             and i.topic_id = t.id(+) " +
		"                             and c.parent_id(+) = i.id " +
		"                             and i.id = v.idea_id (+) " +
		"                             and v.voter (+) = '" + user + "' " +
		"                             and i.id = ti.idea_id (+) " +
		"                             and ti.tracking_user (+) = '" + user + "' " +
		"                             and i.id = t.idea_id(+) ) x ) a " +
		"          where rownum <= " + upperRowCount + " ) " +
		" where rnum >= " + lowerRowCount; 

	ideaFeed(sql, [], successHandler, errorHandler);
};

exports.ignoredIdeasFeed = ignoredIdeasFeed = function(user, successHandler, errorHandler) {
	logger.info('apexClient.myItemsFeed(%s)', user);
	var lowerRowCount = 1;
	var upperRowCount = 25;
	var sql =
		"select * " +
		"  from ( select rownum rnum, a.* " +
		"           from ( select x.id, x.owner, x.topic_id, x.topic_title, x.short_desc, x.description, " +
		"                         x.created, x.comment_count, x.tags, x.vote, x.rn " +
		"                    from (select i.id, i.owner, t.id topic_id, t.title topic_title, i.short_desc, " +
		"                                 i.description, i.created, c.comment_count, rownum rn, t.tags, " +
		"                                 v.vote  " +
		"                            from ideas i, topics t, ignored_ideas ii, votes v, " +
		"                                 (select count(*) comment_count, parent_id " +
		"                                    from comments " +
		"                                   where parent_type = 'idea' " +
		"                                   group by parent_id) c, " +
		"                                 (select it.idea_id, " +
		"                                         listagg(it.tag, ' ') within group (order by it.tag) tags " +
		"                                    from idea_tags it " +
		"                                   group by it.idea_id) t " +
		"                           where i.topic_id = t.id(+) " +
		"                             and c.parent_id(+) = i.id " +
		"                             and i.id = t.idea_id(+) " +
		"                             and i.id = ii.idea_id " +
		"                             and v.voter(+) = '" + user + "' " +
		"                             and i.id = v.idea_id (+) " +
		"                             and ii.ignoring_user = '" + user + "' ) x ) a " +
		"          where rownum <= " + upperRowCount + " ) " +
		" where rnum >= " + lowerRowCount;

	ideaFeed(sql, [], successHandler, errorHandler);
};

exports.pastItemsFeed = pastItemsFeed = function(user, successHandler, errorHandler) {
	logger.info('apexClient.pastItemsFeed(%s)', user);
	var lowerRowCount = 1;
	var upperRowCount = 25;
	var sql =
		"select * " +
		"  from ( select rownum rnum, a.* " +
		"           from ( select x.id, x.owner, x.topic_id, x.topic_title, x.short_desc, x.description, " +
		"                         x.created, x.comment_count, x.tags, x.vote, x.tracked, x.rn " +
		"                    from (select i.id, i.owner, t.id topic_id, t.title topic_title, i.short_desc, " +
		"                                 i.description, i.created, i.closed, c.comment_count, ta.tags, rownum rn, " +
		"                                 decode(ti.tracked,null,'no','yes') tracked, v.vote " +
		"                            from ideas i, topics t, tracked_ideas ti, votes v, " +
		"                                 (select count(*) comment_count, parent_id " +
		"                                    from comments " +
		"                                   where parent_type = 'idea' " +
		"                                   group by parent_id) c, " +
		"                                 (select it.idea_id, " +
		"                                         listagg(it.tag, ' ') within group (order by it.tag) tags " +
		"                                    from idea_tags it " +
		"                                   group by it.idea_id) ta " +
		"                           where t.id (+) = i.topic_id " +
		"                             and i.id = c.parent_id (+) " +
		"                             and i.id = ta.idea_id (+) " +
		"                             and i.id = v.idea_id (+) " +
		"                             and v.voter (+) = '" + user + "' " +
		"                             and i.id = ti.idea_id (+) " +
		"                             and ti.tracking_user (+) = '" + user + "' " +
		"                             and (i.closed is not null or " +
		"                                  i.id in (select idea_id from votes where voter = '" + user + "'))) x ) a " +
		"          where rownum <= " + upperRowCount + " ) " +
		" where rnum >= " + lowerRowCount;

	ideaFeed(sql, [], successHandler, errorHandler);
};

var ideaFeed = function(sql, params, successHandler, errorHandler) {
	logger.info('apexClient.ideaFeed');
	logger.info('sql [%s]', sql);
	logger.info('params [%s]', params);
	logger.info('successHandler [%s]', successHandler);
	logger.info('errorHandler [%s]', errorHandler);

	function transformAndThenInvokeNativeSuccessHandler(data) {
		logger.info('found %s ideas', data.length);
		var resultData = [];
		_.each(data, function(rawItem) {
			var resultItem = convertFromDataToTransport(rawItem);
			resultData.push(resultItem);
		});
		successHandler(resultData);
	}

	runSql(sql, params, transformAndThenInvokeNativeSuccessHandler, errorHandler);
};

// customize this if needed to convert from oracle response to transport
function convertFromDataToTransport(dataItem) {

	if (!dataItem) return dataItem;

	var transport = {};
	transport.id = dataItem.ID;
	transport.topic_id = dataItem.TOPIC_ID;
	transport.topic_title = dataItem.TOPIC_TITLE;
	transport.tracked = dataItem.TRACKED;
	transport.vote = dataItem.VOTE;
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
	transport.search = dataItem.SEARCH;
	return transport;
}

exports.fetchIdea = fetchIdea = function(id, successHandler, errorHandler) {
	logger.info('apexClient.fetchIdea(%s)', id);

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

	runSql(sql, [], function(data) {
		console.log('found %s record(s)', data.length);
		if (data.length === 0) successHandler(undefined);
		var resultItem = convertFromDataToTransport(data[0]);
		successHandler(resultItem);
	}, errorHandler);
};

exports.fetchVotingResult = fetchVotingResult = function(id, user, successHandler, errorHandler) {
	logger.info('apexClient.fetchVotingResult(%s,%s)', id, user);
	logger.error('not implemented');
	// return true/false/null to indicate user's vote for this item
};

exports.voteYes = voteYes = function(id, user, successHandler, errorHandler) {
	logger.info('apexClient.voteYes(%s,%s)', id, user);
	vote(id, user, true, successHandler, errorHandler);
};
exports.voteNo = voteNo = function(id, user, successHandler, errorHandler) {
	logger.info('apexClient.voteNo(%s,%s)', id, user);
	vote(id, user, false, successHandler, errorHandler);
};

exports.vote = vote = function(id, user, rawVotingResult, successHandler, errorHandler) {
	logger.info('apexClient.vote(%s,%s,%s)', id, user, rawVotingResult);

	var votingResult = stringToYesNo(rawVotingResult);
	var sql = "call th_ideas_pkg.vote_on_idea(:1,:2,:3)";
	var params = [id, user, votingResult];

	runSql(sql, params, successHandler, errorHandler);
};

exports.fetchTrackingValueForUser = fetchTrackingValueForUser = function(id, user, successHandler, errorHandler) {
	logger.info('apexClient.fetchTrackingValueForUser(%s,%s)', id, user);
	logger.error('not implemented');
	// return true/false
};
exports.trackItem = trackItem = function(id, user, successHandler, errorHandler) {
	logger.info('apexClient.trackItem(%s,%s)', id, user);

	var sql = "call th_ideas_pkg.track_an_idea(:1,:2)";
	var params = [id, user];

	runSql(sql, params, successHandler, errorHandler);
};
exports.untrackItem = untrackItem = function(id, user, successHandler, errorHandler) {
	logger.info('apexClient.unTrackItem(%s,%s)', id, user);

	var sql = "call th_ideas_pkg.untrack_an_idea(:1,:2)";
	var params = [id, user];

	runSql(sql, params, successHandler, errorHandler);
};

exports.ignoreIdea = ignoreIdea = function(id, user, successHandler, errorHandler) {
	logger.info('apexClient.ignoreIdea(%s,%s)', id, user);

	var sql = "call th_ideas_pkg.ignore_idea(:1,:2)";
	var params = [id, user];

	runSql(sql, params, successHandler, errorHandler);
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


exports.loginUser = loginUser = function(user, pw, successHandler, errorHandler) {
	// DO NOT LOG THE PASSWORD! THESE ARE USERS' ACCOUNT CREDENTIALS!
	logger.info('apexClient.loginUser(%s,%s)', user, pw);

	var sql = "call th_auth_pkg.login_user(:1,:2,:3,:4,:5,:6,:7)";
	var params = [user, pw, new oracle.OutParam(oracle.OCCISTRING),
                                new oracle.OutParam(oracle.OCCISTRING),
                                new oracle.OutParam(oracle.OCCISTRING),
                                new oracle.OutParam(oracle.OCCISTRING),
                                new oracle.OutParam(oracle.OCCISTRING)];

	function formatAndCallSuccessHandler(data) {
		var transport = {};
		if (data.returnParam) {
			transport.token = data.returnParam;
			transport.username = data.returnParam1;
			transport.firstname = data.returnParam2;
			transport.lastname = data.returnParam3;
			transport.email = data.returnParam4;
			successHandler(data);
		}
	}
	runSql(sql, params, formatAndCallSuccessHandler, errorHandler);
};



exports.verifyUser = verifyUser = function(user, userToken, successHandler, errorHandler) {
	logger.info('apexClient.verifyUser(%s,%s)', user, userToken);

	var sql = "call th_auth_pkg.auth_user(:1,:2)";
	var params = [user, userToken];

	runSql(sql, params, formatAndCallSuccessHandler, errorHandler);
};



exports.createIdea = createIdea = function(item, user, successHandler, errorHandler) {
	logger.info('apexClient.createIdea(%s,%s)', item, user);
	console.dir(item);

	var sql = "call th_ideas_pkg.create_idea(:1,:2,:3,:4,:5,:6,:7)";
	var params = [item.short_description, user, item.long_description, 
                      '#testdata', 'month', null, new oracle.OutParam(oracle.OCCIINT)];

	function formatAndCallSuccessHandler(data) {
		if (data.returnParam) data.itemId = data.returnParam;
		successHandler(data);
	}
	runSql(sql, params, formatAndCallSuccessHandler, errorHandler);
};

exports.fetchComments = fetchComments = function(id, successHandler, errorHandler) {
	logger.info('apexClient.fetchComments(%s)', item);

	var sql = "select comments ..."; //TODO
	var params = [];

	runSql(sql, params, successHandler, errorHandler);
};

exports.saveComment = saveComment = function(id, user, comment, successHandler, errorHandler) {
	logger.info('apexClient.saveComment(%s,%s,%s)', item, user, comment);

	var sql = "call th_comments_pkg.create_comment(:1,:2,:3,:4)"; 
	var params = [id, 'idea', comment, user];

	runSql(sql, params, successHandler, errorHandler);
};

exports.suspendIdea = suspendIdea = function(id, user, successHandler, errorHandler) {
	logger.info('apexClient.suspendIdea(%s,%s)', id, user);

	var sql = "call th_ideas_pkg.suspend_idea(:1,:2)";
	var params = [id, user];

	runSql(sql, params, successHandler, errorHandler);
};

var pd = require('pretty-data').pd;

function runSql(sql, params, successHandler, errorHandler) {
	var connString = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=demos.agilex.com)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=XE)))";
	var connectData = {
		"tns": connString,
		"user": "th",
		"password": "th",
		"ConnectionTimeout": "1"
	};

	logger.info('connecting to oracle');

	oracle.connect(connectData, function(err, connection) {
		if (err) {
			logger.warn('Error connecting to db:', err);
			return errorHandler(err);
		}

		var prettySql = pd.sql(sql);

		logger.info('execute sql [%s][%s]', prettySql, params);
		connection.execute(sql, params, function(err, results) {
			if (err) {
				console.log('Error executing sql [%s]', err);
				return errorHandler(err);
			}

			logger.info('complete executing sql');
			connection.close(); // call only when query is finished executing
			return successHandler(results);
		});
	});
}
