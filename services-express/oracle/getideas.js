var oracle = require('oracle');

var connString = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=demos.agilex.com)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=XE)))";
var connectData = { "tns": connString, "user": "th", "password": "th" };

oracle.connect(connectData, function(err, connection) {
    if (err) { console.log("Error connecting to db:", err); return; }

    connection.setPrefetchRowCount(50);

    var getIdeasQuery = "select x.id, x.short_desc, x.description, x.created, nvl(x.comment_count,0) comment_count, x.tags, x.rn"+
                        "  from (select i.id, i.short_desc, i.description, i.created, c.comment_count, rownum rn,"+
                        "               t.tags"+
                        "          from ideas i,"+
                        "               (select count(*) comment_count, parent_id"+
                        "                  from comments"+
                        "                 where parent_type = 'idea'"+
                        "                 group by parent_id) c,"+
                        "               (select it.idea_id,"+
                        "                       listagg(it.tag, ' ') within group (order by it.tagged) tags"+
                        "                  from idea_tags it"+
                        "                 group by it.idea_id) t"+
                        "         where c.parent_id (+) = i.id"+
                        "           and i.id = t.idea_id (+) ) x ";

    var reader = connection.reader(getIdeasQuery, []);
//    if (err) { console.log("Error executing query:", err); return; }

    function doRead(cb) {
        reader.nextRow(function(err, row) {
            if (err) return cb(err);
            if (row) {
                // do something with row
                console.log("got " + JSON.stringify(row));
                // recurse to read next record
                return doRead(cb)
            } else {
                // we are done
                return cb();
            }
        })
    }
    
    doRead(function(err) {
        if (err) {
		console.log("hit an error", err);
		throw err; // or log it
	}
        console.log("all records processed");
    });
});




/*/

    var getIdeasQuery = "select *"+
                        "  from ( select rownum rnum, a.*"+
                        "           from ( select x.id, x.short_desc, x.description, x.created, x.comment_count, x.tags, x.rn"+
                        "                    from (select i.id, i.short_desc, i.description, i.created, c.comment_count, rownum rn,"+
                        "                                 t.tags"+
                        "                            from ideas i,"+
                        "                                 (select count(*) comment_count, parent_id"+
                        "                                    from comments"+
                        "                                   where parent_type = 'idea'"+
                        "                                   group by parent_id) c,"+
                        "                                 (select it.idea_id,"+
                        "                                         listagg(it.tag, ' ') within group (order by it.tagged) tags"+
                        "                                    from idea_tags it"+
                        "                                   group by it.idea_id) t"+
                        "                           where c.parent_id = i.id"+
                        "                             and i.id = t.idea_id ) x ) a"+
                        "          where rownum <= 4 )"+
                        " where rnum >= 2";
*/
