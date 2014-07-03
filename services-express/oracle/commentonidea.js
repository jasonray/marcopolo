/*
	COMMENT ON IDEA
        FUNCTION COMMENT_ON_IDEA RETURNS NUMBER
         Argument Name			Type			In/Out Default?
         ------------------------------ ----------------------- ------ --------
         P_ID				NUMBER			IN
         P_COMMENT_TXT			CLOB			IN
         P_COMMENTER			VARCHAR2(200)		IN
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
		"call th_ideas_pkg.comment_on_idea(:1, :2, :3)",
		[999, "new comment on 999", "dillons"],
	        function(err, results) {
			if (err) { console.log("Error commenting on idea: ", err); return; }

    			console.log(results);
       			connection.close(); // call only when query is finished executing
    		}
	);
});

