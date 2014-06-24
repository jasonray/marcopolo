set define off
create or replace package th_comments_pkg as


	-- get a comment row
	function get_comment (p_id comments.id%type) return comments%rowtype;

	-- create a comment
	function create_comment (p_parent_id	comments.parent_id%type,
				p_parent_type	comments.parent_type%type,
				p_comment_txt	comments.comment_txt%type,
				p_commenter	comments.owner%type) return comments%rowtype; 

	procedure create_comment (p_parent_id	comments.parent_id%type,
				p_parent_type	comments.parent_type%type,
				p_comment_txt	comments.comment_txt%type,
				p_commenter	comments.owner%type);

end th_comments_pkg;
/
show errors



create or replace package body th_comments_pkg as


	---------------------------------------------
	-- get a comment
	function get_comment (p_id comments.id%type) return comments%rowtype
	is
                l_comment comments%rowtype;
        begin
		if p_id is null then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		end if;
		--
                select *
                  into l_comment
                  from comments
                 where id = p_id;
                --
                return l_comment;
        exception
                when NO_DATA_FOUND then
                        -- TODO: log no comment found when looking for it
                        raise_application_error(th_constants_pkg.NO_COMMENT_CODE,
						th_constants_pkg.NO_COMMENT_MSG);
                when TOO_MANY_ROWS then
                        -- TODO: log more than one row that met the criteria was selected
                        -- this shouldn't be possible if comment id is the primary key (hence unique)
                        raise;
	end get_comment;



	---------------------------------------------
	-- create a comment
	procedure create_comment (p_parent_id	comments.parent_id%type,
				p_parent_type	comments.parent_type%type,
				p_comment_txt	comments.comment_txt%type,
				p_commenter	comments.owner%type)
	is
		l_comment comments%rowtype;
	begin
		if p_parent_id is null then
			raise_application_error(th_constants_pkg.NO_PARENT_ID_CODE,
						th_constants_pkg.NO_PARENT_ID_MSG);
		elsif p_parent_type not in ('idea', 'topic') then
			raise_application_error(th_constants_pkg.INVALID_PARENT_TYPE_CODE,
						th_constants_pkg.INVALID_PARENT_TYPE_MSG);
		elsif p_comment_txt is null then
			raise_application_error(th_constants_pkg.NO_COMMENT_CODE,
						th_constants_pkg.NO_COMMENT_MSG);
		elsif p_commenter is null then
			raise_application_error(th_constants_pkg.NO_COMMENTER_CODE,
						th_constants_pkg.NO_COMMENTER_MSG);
		end if;
		--
		-- error checking inside create_comment() function
		--
		l_comment := create_comment(p_parent_id	=> p_parent_id,
					p_parent_type	=> p_parent_type,
					p_comment_txt	=> p_comment_txt,
					p_commenter	=> p_commenter);
	end create_comment;


	-- create a comment
	function create_comment (p_parent_id	comments.parent_id%type,
				p_parent_type	comments.parent_type%type,
				p_comment_txt	comments.comment_txt%type,
				p_commenter	comments.owner%type) return comments%rowtype
	is
		l_comment comments%rowtype;
	begin
		if p_parent_id is null then
			raise_application_error(th_constants_pkg.NO_PARENT_ID_CODE, 
						th_constants_pkg.NO_PARENT_ID_MSG);
		elsif p_parent_type not in ('idea', 'topic') then
			raise_application_error(th_constants_pkg.INVALID_PARENT_TYPE_CODE, 
						th_constants_pkg.INVALID_PARENT_TYPE_MSG);
		end if;
		--
		insert into comments (parent_id, parent_type, comment_txt, owner)
		values (p_parent_id, p_parent_type, p_comment_txt, p_commenter)
		returning id into l_comment.id;
		--
		return get_comment(l_comment.id);
	exception
		when DUP_VAL_ON_INDEX then
			-- TODO: log tried to insert a tag that already exists
			raise;
	end create_comment;


end th_comments_pkg;
/
show errors

