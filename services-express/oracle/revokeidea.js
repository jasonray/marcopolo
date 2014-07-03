/*
	REVOKE AN IDEA
        PROCEDURE REVOKE_IDEA
         Argument Name			Type			In/Out Default?
         ------------------------------ ----------------------- ------ --------
         P_ID				NUMBER			IN
         P_REVOKER			VARCHAR2(200)		IN

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
		"call th_ideas_pkg.revoke_idea(:1, :2)",
		[999, "dillons"],
	        function(err, results) {
			if (err) { console.log("Error revoking idea: ", err); return; }

    			console.log(results);
       			connection.close(); // call only when query is finished executing
    		}
	);
});

