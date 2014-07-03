col owner 		for a20
col last_edited_by 	for a20
col short_desc 		for a40
col description		for a40
col revoked_by 		for a20
col suspended_by	for a20
col closed_by 		for a20
col voter 		for a20
col vote 		for a5
col idea_id 		for 999

prompt ..IDEAS
begin
  for i in (select id, substr(short_desc,1,40) short_desc, 
	           dbms_lob.substr(description,40) description, 
	           owner,
	           to_char(created,'ddmonyy:hhmi') created,
	           last_edited_by,
	           to_char(last_edited,'ddmonyy:hhmi') last_edited,
	           suspended_by,
	           to_char(suspended,'ddmonyy:hhmi') suspended,
	           revoked_by,
	           to_char(revoked,'ddmonyy:hhmi') revoked,
	           closed_by,
	           to_char(closed,'ddmonyy:hhmi') closed
             from ideas 
            where id = 999
            order by id) loop
    dbms_output.put_line('id = ' || i.id);
    dbms_output.put_line('short_desc = ' || i.short_desc);
    dbms_output.put_line('desc = ' || i.description);
    dbms_output.put_line('created = ' || i.owner || ':' || i.created);
    dbms_output.put_line('last_edited_by = ' || i.last_edited_by || ':' || i.last_edited);
    dbms_output.put_line('suspended_by = ' || i.suspended_by || ':' || i.suspended);
    dbms_output.put_line('revoked_by = ' || i.revoked_by || ':' || i.revoked);
    dbms_output.put_line('closed_by = ' || i.closed_by || ':' || i.closed);
  end loop;
end;
/

prompt ..TRACKED IDEAS
select idea_id, tracking_user owner, tracked
  from tracked_ideas
 where idea_id = 999
 order by idea_id
/

prompt ..IDEA COMMENTS
select id, owner, comment_txt
  from comments
 where parent_type = 'idea'
   and parent_id = 999
/

prompt ..USERS IGNORING
select ignoring_user
  from ignored_ideas
 where idea_id = 999
/

prompt ..VOTES
select idea_id, voter, vote
  from votes
 where idea_id = 999
/

prompt ..TAGS
select tag, tagged
  from idea_tags
 where idea_id = 999
/

