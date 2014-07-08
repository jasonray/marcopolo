set define off
create or replace package th_ideas_pkg as

	-- create an idea
	procedure create_idea (p_short_desc	ideas.short_desc%type, 
			p_owner			ideas.owner%type,
			p_description		ideas.description%type,
			p_tags			clob default null,
			p_topic_id		ideas.topic_id%type default null,
                        p_id		out	ideas.id%type);


	procedure create_idea (p_short_desc	ideas.short_desc%type, 
			p_owner			ideas.owner%type,
			p_description		ideas.description%type,
			p_tags			clob default null,
			p_topic_id		ideas.topic_id%type default null);


	-- create an idea
	function create_idea (p_short_desc	ideas.short_desc%type, 
			p_owner			ideas.owner%type,
			p_description		ideas.description%type,
			p_tags			clob default null,
			p_topic_id		ideas.topic_id%type default null)
		return ideas.id%type;


	-- update idea description(s)
	procedure update_idea (p_id		ideas.id%type,
			p_short_desc		ideas.short_desc%type,
			p_description		ideas.description%type,
			p_updater		ideas.last_edited_by%type);



	-- close an idea
	procedure close_idea (p_id		ideas.id%type,
			p_closer		users.username%type);


	-- suspend an idea
	procedure suspend_idea (p_id		ideas.id%type,
			p_suspender		users.username%type);


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

	-- comment on an idea
	procedure comment_on_idea (p_id		comments.parent_id%type,
			p_comment_txt		comments.comment_txt%type,
			p_commenter		comments.owner%type);

	-- ignore an idea
	procedure ignore_idea (p_id		ignored_ideas.idea_id%type,
			p_ignorer		ignored_ideas.ignoring_user%type);

	-- unignore an idea
	procedure unignore_idea (p_id		ignored_ideas.idea_id%type,
			p_ignorer		ignored_ideas.ignoring_user%type);

	-- vote on an idea
	procedure vote_on_idea (p_id		votes.idea_id%type,
			p_voter			votes.voter%type,
			p_vote			votes.vote%type);

	-- track an idea
	procedure track_an_idea (p_id		tracked_ideas.idea_id%type,
			p_user			tracked_ideas.tracking_user%type);

	-- stop tracking an idea
	procedure untrack_an_idea (p_id		tracked_ideas.idea_id%type,
			p_user			tracked_ideas.tracking_user%type);

	-- remove all associated records for a particular idea
	--  votes, comments, tracking, suspension, revocation, closing, tags
	procedure reset_idea (p_id		ideas.id%type);
end th_ideas_pkg;
/
show errors


create or replace package body th_ideas_pkg as


	---------------------------------------------
	-- create an idea
	procedure create_idea (p_short_desc	ideas.short_desc%type, 
			p_owner			ideas.owner%type,
			p_description		ideas.description%type,
			p_tags			clob default null,
			p_topic_id		ideas.topic_id%type default null,
                        p_id		out	ideas.id%type)
        is
        begin
		p_id := create_idea (p_short_desc	=> p_short_desc,
					p_owner		=> p_owner,
					p_description	=> p_description,
					p_topic_id	=> p_topic_id,
					p_tags		=> p_tags);
        end create_idea;


	procedure create_idea (p_short_desc	ideas.short_desc%type, 
			p_owner			ideas.owner%type,
			p_description		ideas.description%type,
			p_tags			clob default null,
			p_topic_id		ideas.topic_id%type default null)
        is
		l_id	ideas.id%type;
        begin
		l_id := create_idea (p_short_desc	=> p_short_desc,
					p_owner		=> p_owner,
					p_description	=> p_description,
					p_topic_id	=> p_topic_id,
					p_tags		=> p_tags);
        end create_idea;


	---------------------------------------------
	-- create an idea
	function create_idea (p_short_desc	ideas.short_desc%type, 
			p_owner			ideas.owner%type,
			p_description		ideas.description%type, 
			p_tags			clob default null,
			p_topic_id		ideas.topic_id%type default null)
		return ideas.id%type
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
		insert into ideas (short_desc, description, owner, topic_id)
		values (p_short_desc, p_description, p_owner, p_topic_id)
		returning id into l_id;
		return l_id;

		-- insert tags on this idea
--		th_tags_pkg.create_tag () 
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
		       closed_by = p_closer,
		       last_edited_by = p_closer
		 where id = p_id;
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to close an idea that doesn't exist
			null;
		end if;
	end;


	-- suspend an idea
	procedure suspend_idea (p_id		ideas.id%type,
			p_suspender		users.username%type)
	is
	begin
		if (p_id is null) then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_suspender is null or length(p_suspender) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_SUSPENDER_CODE,
						th_constants_pkg.NO_SUSPENDER_MSG);
		end if;
		--
		update ideas
		   set suspended = sysdate,
		       suspended_by = p_suspender,
		       last_edited_by = p_suspender
		 where id = p_id;
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to revoke an idea that doesn't exist
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
		       revoked_by = p_revoker,
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
			

	-- comment on an idea (procedure)
	procedure comment_on_idea (p_id		comments.parent_id%type,
			p_comment_txt		comments.comment_txt%type,
			p_commenter		comments.owner%type)
	is
		l_id comments.id%type;
	begin
		l_id := comment_on_idea(p_id, p_comment_txt, p_commenter);
	end comment_on_idea;


	-- vote on an idea
	procedure vote_on_idea (p_id		votes.idea_id%type,
			p_voter			votes.voter%type,
			p_vote			votes.vote%type)
	is
	begin
		if (p_id is null) then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_voter is null or length(p_voter) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_VOTER_CODE,
						th_constants_pkg.NO_VOTER_MSG);

		elsif lower(p_vote) not in ('yes', 'no') then
			raise_application_error(th_constants_pkg.NO_VOTE_CODE,
						th_constants_pkg.NO_VOTE_MSG);

		end if;
		--
		delete from votes where idea_id = p_id and voter = p_voter;
		insert into votes (idea_id, voter, vote)
		values (p_id, p_voter, p_vote);
	end vote_on_idea;



	-- ignore an idea
	procedure ignore_idea (p_id		ignored_ideas.idea_id%type,
			p_ignorer		ignored_ideas.ignoring_user%type)
	is
	begin
		insert into ignored_ideas (idea_id, ignoring_user)
		values (p_id, p_ignorer);
	exception
		when dup_val_on_index then
			--TODO: log the duplicate ignore. WHY did we get a dupe?!
			raise_application_error(th_constants_pkg.ALREADY_IGNORED_CODE,
						th_constants_pkg.ALREADY_IGNORED_MSG);
	end ignore_idea;

	-- unignore an idea
	procedure unignore_idea (p_id		ignored_ideas.idea_id%type,
			p_ignorer		ignored_ideas.ignoring_user%type)
	is
	begin
		delete from ignored_ideas
		 where idea_id = p_id
 		   and ignoring_user = p_ignorer;
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to unignore an idea that the user isn't ignoring
			null;
		end if;
	end unignore_idea;


	-- track an idea
	procedure track_an_idea (p_id		tracked_ideas.idea_id%type,
			p_user			tracked_ideas.tracking_user%type)

	is
	begin
		insert into tracked_ideas (idea_id, tracking_user)
		values (p_id, p_user);
	exception
		when DUP_VAL_ON_INDEX then
			raise_application_error(th_constants_pkg.ALREADY_TRACKED_CODE,
						th_constants_pkg.ALREADY_TRACKED_MSG);
	end track_an_idea;


	-- stop tracking an idea
	procedure untrack_an_idea (p_id		tracked_ideas.idea_id%type,
			p_user			tracked_ideas.tracking_user%type)
	is
	begin
		delete 
		  from tracked_ideas
 		 where idea_id = p_id
		   and tracking_user = p_user;
		-- TODO: do we return an error if this user wasn't tracking in the first place?! do we care?
	end untrack_an_idea;


	-- remove all associated records for a particular idea
	--  votes, comments, tracking, suspension, revocation, closing, tags
	procedure reset_idea (p_id		ideas.id%type)
	is
	begin
		delete from comments
		 where parent_type = 'idea'
		   and parent_id = p_id;
		--
		delete from votes
		 where idea_id = p_id;
		--
		delete from idea_tags
		 where idea_id = p_id;
		--
		delete from tracked_ideas
		 where idea_id = p_id;
		--
		update ideas
		   set closed = null,
			closed_by = null,
			revoked = null,
			revoked_by = null,
			suspended = null,
			suspended_by = null
		 where id = p_id;
	end reset_idea;

end th_ideas_pkg;
/
show errors




