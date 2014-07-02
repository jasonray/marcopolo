var oracle = require("oracle");

exports.isHealthy = function(callback) {
	var connString = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=demos.agilex.com)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=XE)))";
	var connectData = {
		"tns": connString,
		"user": "th",
		"password": "th",
		"ConnectionTimeout": "1"
	};

	console.log('connect to oracle');

	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log("XError connecting to db:", err);
			return callback(false);
		}

		console.log('execute oracle query');
		connection.execute("SELECT systimestamp FROM dual", [], function(err, results) {
			if (err) {
				console.log("Error executing query:", err);
				return callback(false);
			}

			console.log(results);
			connection.close(); // call only when query is finished executing
			return callback(true);
		});
	});
};