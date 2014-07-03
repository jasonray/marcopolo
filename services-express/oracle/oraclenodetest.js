var oracle = require('oracle');

/*
var connectData = {
    hostname: "192.168.56.101",
    port: 1521,
    database: "orcl", // System ID (SID)
    user: "cp",
    password: "cp"
}
*/

var connString = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=demos.agilex.com)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=XE)))";
var connectData = { "tns": connString, "user": "th", "password": "th" };

oracle.connect(connectData, function(err, connection) {
    if (err) { console.log("XError connecting to db:", err); return; }

    connection.execute("SELECT systimestamp FROM dual", [], function(err, results) {
        if (err) { console.log("Error executing query:", err); return; }

        console.log(results);
        connection.close(); // call only when query is finished executing
    });
});

