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

exports.fetchIdeas = fetchIdeas = function() {
	var resultData = [];
	_.each(data, function(rawItem) {
		var resultItem = convertFromDataToTransport(rawItem);
		resultData.push(resultItem);
	});
	return resultData;
};