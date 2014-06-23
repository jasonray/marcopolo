set define off
create or replace package th_ideas_pkg as

	-- create an idea
	function create_idea (p_short_desc	ideas.short_desc%type, 
			p_description		ideas.description%type, 
			p_owner			ideas.owner%type) return ideas.id%type;


	-- update idea description(s)
	procedure update_idea (p_id		ideas.id%type,
			p_short_desc		ideas.short_desc%type,
			p_description		ideas.description%type,
			p_updater		ideas.last_edited_by%type);



	-- close an idea
	procedure close_idea (p_id		ideas.id%type,
			p_closer		users.username%type);


	-- revoke an idea
	procedure revoke_idea (p_id		ideas.id%type,
			p_revoker		users.username%type);


	-- tag an idea
	procedure tag_idea (p_id		idea_tags.idea_id%type,
			p_tag			idea_tags.tag%type,
			p_tagger		users.username%type);


	-- comment on an idea
	function comment_on_idea (p_id		comments.parent_id%type,
			p_comment_txt		comments.comment_txt%type,
			p_commenter		comments.owner%type) return comments.id%type;


end th_ideas_pkg;
/
show errors



create or replace package body th_ideas_pkg as


	---------------------------------------------
	-- create an idea
	function create_idea (p_short_desc	ideas.short_desc%type, 
			p_description		ideas.description%type, 
			p_owner			ideas.owner%type) return ideas.id%type
	is
		l_id	ideas.id%type;
		l_now	date	:= sysdate;
	begin
		if (p_short_desc is null or length(p_short_desc) > th_constants_pkg.G_SHORTDESC_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_SHORTDESC_CODE,
						th_constants_pkg.NO_SHORTDESC_MSG);
		elsif (p_owner is null or length(p_owner) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_CREATOR_CODE,
						th_constants_pkg.NO_CREATOR_MSG);
		end if;
		--
		insert into ideas (short_desc, description, owner)
		values (p_short_desc, p_description, p_owner)
		returning id into l_id;
		return l_id;
	exception
		when others then
			-- TODO: log tried to insert a row and it threw an error, then reraise exception
			raise;
	end;


	---------------------------------------------
	-- update idea description(s)
	procedure update_idea (p_id		ideas.id%type,
			p_short_desc		ideas.short_desc%type,
			p_description		ideas.description%type,
			p_updater		ideas.last_edited_by%type)
	is
	begin
		if (p_id is null) then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_short_desc is null or length(p_short_desc) > th_constants_pkg.G_SHORTDESC_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_SHORTDESC_CODE,
						th_constants_pkg.NO_SHORTDESC_MSG);
		elsif (p_updater is null or length(p_updater) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_UPDATER_CODE,
						th_constants_pkg.NO_UPDATER_MSG);
		end if;
		--
		update ideas
		   set short_desc = p_short_desc,
		       description = p_description,
		       last_edited_by = p_updater
		 where id = p_id;
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to update an idea that doesn't exist
			null;
		end if;
	end;



	---------------------------------------------
	-- close an idea
	procedure close_idea (p_id		ideas.id%type,
			p_closer		users.username%type)
	is
	begin
		if (p_id is null) then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_closer is null or length(p_closer) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_CLOSER_CODE,
						th_constants_pkg.NO_CLOSER_MSG);
		end if;
		--
		update ideas
		   set closed = sysdate,
		       last_edited_by = p_closer
		 where id = p_id;
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to close an idea that doesn't exist
			null;
		end if;
	end;


	-- revoke an idea
	procedure revoke_idea (p_id		ideas.id%type,
			p_revoker		users.username%type)
	is
	begin
		if (p_id is null) then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_revoker is null or length(p_revoker) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_REVOKER_CODE,
						th_constants_pkg.NO_REVOKER_MSG);
		end if;
		--
		update ideas
		   set revoked = sysdate,
		       last_edited_by = p_revoker
		 where id = p_id;
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to revoke an idea that doesn't exist
			null;
		end if;
	end;


	-- tag an idea
	procedure tag_idea (p_id		idea_tags.idea_id%type,
			p_tag			idea_tags.tag%type,
			p_tagger		users.username%type)
	is
		l_tag tags%rowtype;
	begin
		if (p_id is null) then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_tag is null or length(p_tag) > th_constants_pkg.G_TAG_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_REVOKER_CODE,
						th_constants_pkg.NO_REVOKER_MSG);
		elsif (p_tagger is null or length(p_tagger) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_TAGGER_CODE,
						th_constants_pkg.NO_TAGGER_MSG);
		end if;
		--
		begin
			l_tag := th_tags_pkg.get_tag_row(p_tag);				
		exception
			when NO_DATA_FOUND then
				-- TODO: this could result in yet another error 
				l_tag := th_tags_pkg.create_tag (p_tag => p_tag,
								p_owner => p_tagger);
		end;
		--
		insert into idea_tags (idea_id, tag)
		values (p_id, l_tag.tag);
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to associate a tag to idea, failed for some reason
			-- TODO: determine how we want to manage this issue in the app
			null;
		end if;
	end;


	-- comment on an idea
	function comment_on_idea (p_id		comments.parent_id%type,
			p_comment_txt		comments.comment_txt%type,
			p_commenter		comments.owner%type) return comments.id%type
	is
		l_id comments.id%type;
		l_now date := sysdate;
	begin
		if (p_id is null) then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_commenter is null or length(p_commenter) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_COMMENTER_CODE,
						th_constants_pkg.NO_COMMENTER_MSG);
		end if;
		--
		insert into comments (parent_id, parent_type, comment_txt, owner, last_edited, last_edited_by)
		values (p_id, 'idea', p_comment_txt, p_commenter, l_now, p_commenter);
		--
		return l_id;
	end comment_on_idea;
			

end th_ideas_pkg;
/
show errors




