/*
	VOTE ON AN IDEA
		PROCEDURE VOTE_ON_IDEA
 		Argument Name			Type			In/Out Default?
 		------------------------------ ----------------------- ------ --------
 		P_ID				NUMBER			IN
 		P_VOTER			VARCHAR2(200)		IN
 		P_VOTE 			VARCHAR2(50)		IN
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
		"call th_ideas_pkg.vote_on_idea(:1, :2, :3)",
		[999, "dillons", "yes"],
	        function(err, results) {
			if (err) { console.log("Error tracking idea: ", err); return; }

    			console.log(results);
       			connection.close(); // call only when query is finished executing
    		}
	);
});

