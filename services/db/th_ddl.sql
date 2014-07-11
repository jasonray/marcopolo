drop table votes;
drop table ignored_ideas;
drop table tracked_ideas;
drop table tag_black_list;
drop table suspension_requests;
drop table topic_tags;
drop table idea_tags;
drop table tags;
drop table comments;
drop table ideas;
drop table topics;
drop table users;
drop sequence ideas_seq;
drop database link auth;


create public database link auth
connect to auth
identified by auth 
using 'apps';


create sequence ideas_seq start with 100;


create table users (
	username	varchar2(200) not null,	-- unique id for user
	first_name	varchar2(100),
	last_name	varchar2(100),
	token		varchar2(200), -- used for agilex AD authentication
	email		varchar2(100)
);

alter table users
add constraint users_pk
primary key (username)
/


create table topics (
	id		number 		not null,
	title		varchar2(250) 	not null,	-- title of the topic
	description	clob,				-- description of the topic
	owner		varchar2(200) 	not null,	-- created by
	created		date 		not null,	-- created date
	duration	varchar2(30)	default 'quarter',	-- how long should the topic be available?
	last_edited	date		not null,	-- last edited date
	last_edited_by	varchar2(200) 	not null,	-- who was the last user to edit this topic
	closed		date,				-- when this topic is closed for voting
	closed_by	varchar2(200),			-- who closed this topic
	revoked		date,				-- when was this topic revoked from availability
	revoked_by	varchar2(200),			-- who revoked this topic from availability
	suspended	date,				-- this topic is tagged by a user as inappropriate
	suspended_by	varchar2(200)			-- who suspended this topic
);

alter table topics
add constraint topics_pk
primary key (id);

alter table topics
add constraint topics_username_fk
foreign key (owner)
references users;

alter table topics
add constraint topics_duration_ck
check (duration in ('hour', 'day', 'week', 'month', 'quarter', 'year'));


create table ideas (
	id		number		not null,
	short_desc	varchar2(200)	not null,
	description	clob,
	owner		varchar2(200)	not null,
	created		date		not null,	-- when was this idea created 
	duration	varchar2(30)	default 'month',	-- how long should the idea be available?
	last_edited_by	varchar2(200)	not null,	-- who was the last user to edit the idea
	last_edited	date		not null,	-- when was the last time this idea was edited
	available	date,				-- when is/was this idea open for voting
	closed		date,				-- when is/was this idea closed for voting
	closed_by	varchar2(200),			-- who closed this idea
	revoked		date,				-- when was this idea revoked from availability
	revoked_by	varchar2(200),			-- who revoked this idea from availability
	suspended	date,				-- when was this idea suspended as inappropriate
	suspended_by	varchar2(200),			-- who suspended this idea
	topic_id	number				-- if this idea is associated to a particular topic
);

alter table ideas
add constraint ideas_pk
primary key (id);

alter table ideas
add constraint ideas_owner_fk
foreign key (owner)
references users;

alter table ideas
add constraint ideas_edited_by_fk
foreign key (last_edited_by)
references users;

alter table ideas
add constraint ideas_topics_fk
foreign key (topic_id) 
references topics;

alter table ideas
add constraint ideas_duration_ck
check (duration in ('hour', 'day', 'week', 'month', 'quarter', 'year'));


create table comments (
	id		number		not null,
	parent_id	number		not null,	-- id of the item this comment is associated to
	parent_type	varchar2(40)	not null,	-- in IDEAS, CATEGORIES
	comment_txt	clob		not null,	-- contents of the comment
	owner		varchar2(200)	not null,	-- comment creator
	created		date		not null,	-- when was this comment created
	last_edited_by	varchar2(200)	not null,	-- who was the last user to edit the comment
	last_edited	date		not null,	-- when was the last time this comment was edited
	revoked		date				-- when was this comment revoked from availability
);

alter table comments
add constraint comments_pk
primary key (id);
	
alter table comments
add constraint comments_owner_fk
foreign key (owner)
references users;

alter table comments
add constraint comments_last_edited_by_fk
foreign key (last_edited_by)
references users;


create table tags (
	tag		varchar2(250)	not null,	-- title of the category
	owner		varchar2(200)	not null,	-- created by
	created		date		not null,	-- created date
	last_edited_by	varchar2(200)	not null,	-- who was the last user to edit the tag
	last_edited	date		not null,	-- last edited date of this category
	revoked		date				-- when this tag was identified as inappropriate by admins
);

alter table tags
add constraint tags_pk
primary key (tag);
	
alter table tags
add constraint tags_owner
foreign key (owner)
references users;

alter table tags
add constraint tags_last_edited_by_fk
foreign key (last_edited_by)
references users;


create table topic_tags (
	topic_id	number		not null,
	tag		varchar2(250)	not null,
	tagged		date		not null
);

alter table topic_tags
add constraint topic_tags_pk
primary key (topic_id, tag);

alter table topic_tags
add constraint topic_tags_topics_fk 
foreign key (topic_id)
references topics;

alter table topic_tags
add constraint topic_tags_tags_fk 
foreign key (tag)
references tags;


create table idea_tags (
	idea_id		number,
	tag		varchar2(250),
	tagged		date
);

alter table idea_tags
add constraint idea_tags_pk
primary key (idea_id, tag);

alter table idea_tags
add constraint idea_tags_tags_fk 
foreign key (tag)
references tags;

alter table idea_tags
add constraint idea_tags_ideas_fk 
foreign key (idea_id)
references ideas;


create table suspension_requests (
	parent_id	number		not null,
	parent_type	varchar2(40)	not null,
	suspender	varchar2(200)	not null,
	suspended_date	date,
	overridden_by	varchar2(200),
	overridden      date
);



create table tag_black_list (
	tag		varchar2(250)
);

alter table tag_black_list
add constraint tag_black_list_pk
primary key (tag);


create table votes (
	idea_id		number,
	voter		varchar2(200),
	vote		varchar2(50),
	voted		date
);

alter table votes
add constraint votes_pk
primary key (idea_id, voter, vote);


create table tracked_ideas (
	idea_id		number,
	tracking_user	varchar2(200),
	tracked		date
);

alter table tracked_ideas
add constraint tracked_ideas_pk
primary key (idea_id, tracking_user);

alter table tracked_ideas
add constraint tracked_ideas_idea_fk
foreign key (idea_id)
references ideas;

alter table tracked_ideas
add constraint tracked_ideas_user_fk
foreign key (tracking_user)
references users;



create table ignored_ideas (
	idea_id		number,
	ignoring_user	varchar2(200),
	ignored		date
);

alter table ignored_ideas
add constraint ignored_ideas_pk
primary key (idea_id, ignoring_user);

alter table ignored_ideas
add constraint ignored_ideas_idea_fk
foreign key (idea_id)
references ideas;

alter table ignored_ideas
add constraint ignored_ideas_user_fk
foreign key (ignoring_user)
references users;



