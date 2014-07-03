/*
	CREATE AN IDEA ASSOCIATED TO A TOPIC.  TAKES FIVE PARAMS 
		PROCEDURE CREATE_IDEA
 		Argument Name			Type			In/Out Default?
 		------------------------------ ----------------------- ------ --------
 		P_SHORT_DESC			VARCHAR2(200)		IN
 		P_OWNER			VARCHAR2(200)		IN
 		P_DESCRIPTION			CLOB			IN
 		P_TOPIC_ID			NUMBER			IN
 		P_TAGS 			CLOB			IN
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
		"call th_ideas_pkg.create_idea(:1, :2, :3, :4)",
		["Some Isolated Idea", "dillons", "Some isolated description", "#sometag"],
	        function(err, results) {
			if (err) { console.log("Error calling package.procedure:", err); return; }

    			console.log(results);
       			connection.close(); // call only when query is finished executing
    		}
	);
});

