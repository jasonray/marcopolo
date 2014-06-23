set define off
create or replace package th_topics_pkg as


	-- create an topic
	-- * p_title
	--   p_description
	-- * p_creator
	function create_topic (p_title		topics.title%type, 
			p_description		topics.description%type, 
			p_creator		topics.owner%type) return topics.id%type;


	-- update topic description(s)
	-- * p_id
	-- * p_title
	--   p_description
	-- * p_updater
	procedure update_topic (p_id		topics.id%type,
			p_title			topics.title%type,
			p_description		topics.description%type,
			p_updater		topics.last_edited_by%type);


	-- close a topic
	-- * p_id
	-- * p_closer
	procedure close_topic (p_id		topics.id%type,
			p_closer		users.username%type);


	-- suspend a topic
	-- * p_id
	-- * p_suspender
	procedure suspend_topic (p_id		topics.id%type,
			p_suspender		users.username%type);


	-- revoke a topic
	-- * p_id
	-- * p_revoker
	procedure revoke_topic (p_id		topics.id%type,
			p_revoker		users.username%type);


	-- tag a topic
	-- * p_id
	-- * p_tag
	-- * p_tagger
	procedure tag_topic (p_id		topic_tags.topic_id%type,
			p_tag			topic_tags.tag%type,
			p_tagger		users.username%type);


	-- comment on a topic
	-- * p_id
	-- * p_comment
	-- * p_commenter
	function comment_on_topic (p_id		comments.parent_id%type,
			p_comment_txt		comments.comment_txt%type,
			p_commenter		comments.owner%type) return comments.id%type;


end th_topics_pkg;
/
show errors



create or replace package body th_topics_pkg as


	---------------------------------------------
	-- create an topic
	function create_topic (p_title		topics.title%type, 
			p_description		topics.description%type, 
			p_creator		topics.owner%type) return topics.id%type
	is
		l_id	topics.id%type;
		l_now	date	:= sysdate;
	begin
		if (p_title is null or length(p_title) > th_constants_pkg.G_TITLE_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_TITLE_CODE,
						th_constants_pkg.NO_TITLE_MSG);
		elsif (p_creator is null or length(p_creator) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_CREATOR_CODE,
						th_constants_pkg.NO_CREATOR_MSG);
		end if;
		--
		insert into topics (title, description, owner)
		values (p_title, p_description, p_creator)
		returning id into l_id;
		return l_id;
	exception
		when others then
			-- TODO: log tried to insert a row and it threw an error, then reraise exception
			raise;
	end;


	---------------------------------------------
	-- update topic description(s)
	procedure update_topic (p_id		topics.id%type,
			p_title			topics.title%type,
			p_description		topics.description%type,
			p_updater		topics.last_edited_by%type)
	is
	begin
		if p_id is null then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_title is null or length(p_title) > th_constants_pkg.G_TITLE_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_TITLE_CODE,
						th_constants_pkg.NO_TITLE_MSG);
		elsif (p_updater is null or length(p_updater) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_UPDATER_CODE,
						th_constants_pkg.NO_UPDATER_MSG);
		end if;
		--
		update topics
		   set title = p_title,
		       description = p_description,
		       last_edited_by = p_updater
		 where id = p_id;
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to update an topic that doesn't exist
			null;
		end if;
	end;



	---------------------------------------------
	-- close an topic
	procedure close_topic (p_id		topics.id%type,
			p_closer		users.username%type)
	is
	begin
		if p_id is null then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_closer is null or length(p_closer) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_CLOSER_CODE,
						th_constants_pkg.NO_CLOSER_MSG);
		end if;
		-- 
		update topics set closed = sysdate,
		       closed_by = p_closer,
		       last_edited_by = p_closer
		 where id = p_id;
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to close an topic that doesn't exist
			null;
		end if;
	end;


	---------------------------------------------
	-- revoke an topic
	procedure revoke_topic (p_id		topics.id%type,
			p_revoker		users.username%type)
	is
	begin
		if p_id is null then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_revoker is null or length(p_revoker) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_REVOKER_CODE,
						th_constants_pkg.NO_REVOKER_MSG);
		end if;
		-- 
		update topics
		   set revoked = sysdate,
		       revoked_by = p_revoker,
		       last_edited_by = p_revoker
		 where id = p_id;
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to revoke an topic that doesn't exist
			null;
		end if;
	end;


	---------------------------------------------
	-- suspend a topic
	procedure suspend_topic (p_id		topics.id%type,
			p_suspender		users.username%type)
	is
	begin
		if p_id is null then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_suspender is null or length(p_suspender) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_SUSPENDER_CODE,
						th_constants_pkg.NO_SUSPENDER_MSG);
		end if;
		-- 
		update topics
		   set suspended = sysdate,
		       suspended_by = p_suspender,
		       last_edited_by = p_suspender
		 where id = p_id;
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to revoke an topic that doesn't exist
			null;
		end if;
	end;


	-- tag a topic
	procedure tag_topic (p_id		topic_tags.topic_id%type,
			p_tag			topic_tags.tag%type,
			p_tagger		users.username%type)
	is
		l_tag tags%rowtype;
	begin
		if p_id is null then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif (p_tag is null or length(p_tag) > th_constants_pkg.G_TAG_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_TAG_CODE,
						th_constants_pkg.NO_TAG_MSG);
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
		-- TODO: is adding a tag considered "editing" the topic? do I updated 
		--	 edited_by and last_edited?
		insert into topic_tags (topic_id, tag)
		values (p_id, l_tag.tag);
		--
		if SQL%ROWCOUNT = 0 then
			-- TODO: log tried to associate a tag to topic, failed for some reason
			-- TODO: determine how we want to manage this issue in the app
			null;
		end if;
	end;


	-- comment on a topic
	function comment_on_topic (p_id		comments.parent_id%type,
			p_comment_txt		comments.comment_txt%type,
			p_commenter		comments.owner%type) return comments.id%type
	is
		l_id comments.id%type;
	begin
		if p_id is null then
			raise_application_error(th_constants_pkg.NO_ID_CODE,
						th_constants_pkg.NO_ID_MSG);
		elsif p_comment_txt is null then
			raise_application_error(th_constants_pkg.NO_COMMENT_CODE,
						th_constants_pkg.NO_COMMENT_MSG);
		elsif (p_commenter is null or length(p_commenter) > th_constants_pkg.G_USERNAME_MAXLEN) then
			raise_application_error(th_constants_pkg.NO_COMMENTER_CODE,
						th_constants_pkg.NO_COMMENTER_MSG);
		end if;
		-- 
		-- TODO: is commenting on a topic considered "editing" the topic? 
		-- 	 do I update edited_by and last_edited?
		insert into comments (parent_id, parent_type, comment_txt, owner)
		values (p_id, 'topic', p_comment_txt, p_commenter)
		returning id into l_id;
		return l_id;
	end comment_on_topic;
			

end th_topics_pkg;
/
show errors

