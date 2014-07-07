set define off
create or replace package th_tags_pkg as


	-- get a tag row
	function get_tag_row (p_tag tags.tag%type) return tags%rowtype;


	-- create a tag
	function create_tag (p_tag	tags.tag%type, 
			p_owner		tags.owner%type) return tags%rowtype;

	procedure create_tag (p_tag	tags.tag%type, 
			p_owner		tags.owner%type);



end th_tags_pkg;
/
show errors



create or replace package body th_tags_pkg as


	---------------------------------------------
	-- get a tag row
	function get_tag_row (p_tag tags.tag%type) return tags%rowtype
	is
		l_tag tags%rowtype;
	begin
		select *
		  into l_tag
		  from tags
		 where tag = p_tag;
		--
		return l_tag;
	exception
		when NO_DATA_FOUND then
			-- TODO: log no tag found when looking for it
			raise;
		when TOO_MANY_ROWS then
			-- TODO: log more than one row that met the criteria was selected
			-- this shouldn't be possible of tag is the primary key (hence unique)
			raise;
	end get_tag_row;


	---------------------------------------------
	-- create a tag
	procedure create_tag (p_tag	tags.tag%type, 
			p_owner		tags.owner%type)
	is
		l_tag tags%rowtype;
	begin
		l_tag := create_tag(p_tag, p_owner);
	end create_tag;


	-- create a tag and return the row
	function create_tag (p_tag	tags.tag%type, 
			p_owner		tags.owner%type) return tags%rowtype
	is
	begin
		insert into tags (tag, owner, last_edited_by)
		values (p_tag, p_owner, p_owner);
		--
		return get_tag_row(p_tag);
	exception
		when DUP_VAL_ON_INDEX then
			-- TODO: log tried to insert a tag that already exists
			raise;
	end create_tag;


end th_tags_pkg;
/
show errors

