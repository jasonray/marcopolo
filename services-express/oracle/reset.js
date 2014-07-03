/*
	RESET
		untrack idea 1
		remove comments from idea 1
		reset vote on idea 1
		unsuspend idea 1
		unrevoke idea 1
		untag idea 1
*/

var oracle = require('oracle');

var connString = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)" +
                 "                      (HOST=demos.agilex.com)" +
                 "                      (PORT=1521))" +
                 "              (CONNECT_DATA=(SERVER=DEDICATED)" +
                 "                            (SERVICE_NAME=XE))" +
                 ")";
var connectData = { "tns": connString, "user": "th", "password": "th" };

oracle.connect(connectData, function(err, connection) {
	if (err) { console.log("Error connecting to db:", err); return; }

	connection.execute(
		"call th_ideas_pkg.reset_idea(:1)",
		[999],
	        function(err, results) {
			if (err) { console.log("Error reseting idea: ", err); return; }

    			console.log(results);
       			connection.close(); // call only when query is finished executing
    		}
	);
});

