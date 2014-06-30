-- insert users
insert into users (username, first_name, last_name, email) values ('dillons', 'Sean', 'Dillon', 'sean.dillon@agilex.com');
insert into users (username) values ('cushingb');
insert into users (username, first_name, last_name) values ('rayj', 'Jason', 'Ray');
insert into users (username, first_name, last_name) values ('sancheza', 'Analisa', 'Sanchez');


-- insert tags
insert into tags (tag, owner) values ('#social', 'dillons');
insert into tags (tag, owner) values ('#food', 'dillons');
insert into tags (tag, owner) values ('#agilex', 'dillons');
insert into tags (tag, owner) values ('#interns', 'dillons');
insert into tags (tag, owner) values ('#node', 'dillons');
insert into tags (tag, owner) values ('#compensation', 'dillons');


-- insert topics
declare
  l_i ideas.id%type;
  l_t topics.id%type;
  l_t2 topics.id%type;
begin

  l_t := th_topics_pkg.create_topic(p_title => 'What can we do that''s fun on Friday afternoons?',
                                    p_description => 'More prose about Friday afternoons here...',
                                    p_creator => 'dillons');

  


  l_t2 := th_topics_pkg.create_topic(p_title => 'Where''s a good place to watch the World Cup',
				     p_description => null,
                                     p_creator => 'dillons');

  l_i := th_ideas_pkg.create_idea (p_short_desc => 'Wouldn''t it be fun to watch soccer on Friday afternoons?',
                                   p_owner => 'cushingb',
                                   p_description => null,
                                   p_topic_id => l_t,
                                   p_tags => '#social #agilex');

  l_i := th_ideas_pkg.create_idea (p_short_desc => 'Friday afternoons are a great day for happy hours!',
                                   p_owner => 'sancheza',
                                   p_description => null,
                                   p_topic_id => l_t,
                                   p_tags => '#social #agilex');

  l_i := th_ideas_pkg.create_idea (p_short_desc => 'We should have hackathons on Friday afternoons w/ Node as a theme.',
                                   p_owner => 'rayj',
                                   p_description => null,
                                   p_topic_id => l_t,
                                   p_tags => '#social #agilex #node');

end;
/


-- insert ideas
insert into ideas (id, short_desc, owner, available) 
	values (1, 'How about we have dippin'' dots on Friday afternoons?', 'cushingb', sysdate-5);
insert into ideas (short_desc, owner, available) 
	values ('I believe all UI/UX designers should get a raise.', 'cushingb', sysdate-3);
insert into ideas (short_desc, owner, available) 
	values ('Foosball should be a required activity during the day.', 'cushingb', sysdate-2);

insert into idea_tags (idea_id, tag) values (1, '#social');
insert into idea_tags (idea_id, tag) values (1, '#food');

insert into ideas (id, short_desc, owner, available) 
	values (2, 'I believe all NODE developers should get a raise.', 'rayj', sysdate-10);
insert into ideas (short_desc, owner, available) 
	values ('I think we should use NODE for every and all projects from now on at Agilex.', 'rayj', sysdate-15);
insert into ideas (short_desc, owner, available) 
	values ('How about we get together for carrot cake on Thursday mornings?', 'rayj', sysdate-1);

insert into idea_tags (idea_id, tag) values (2, '#agilex');
insert into idea_tags (idea_id, tag) values (2, '#node');
insert into idea_tags (idea_id, tag) values (2, '#compensation');

insert into ideas (id, short_desc, owner, available) 
	values (3, 'I believe all scrum masters should get a raise.', 'sancheza', sysdate-6);
insert into ideas (short_desc, owner, available) 
	values ('I think we should use Target Process for every and all projects from now on at Agilex.', 'sancheza', sysdate);
insert into ideas (short_desc, owner, available) 
	values ('How about we get together for soccer on Wednesday nights?', 'sancheza', sysdate-9);

insert into ideas (id, short_desc, owner, available) 
	values (4, 'How many people would like to have ALOHA FRIDAYS?! You wear Hawaiian shirts to work :).', 'dillons', sysdate);

insert into idea_tags (idea_id, tag) values (3, '#agilex');

-- insert comments
--	I'm sure there's a way to dynamically get the values from the rows above from ideas entered, but I'm hard coding
--	values in these scripts for simplicity.  This is all sample data anyway.
insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (1, 'idea', 'How about NORMAL ice cream?!', 'dillons');
insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (1, 'idea', 'Dillon, you''re such a dinosaur. Get w/ the d-dots program yo''', 'cushingb');
insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (1, 'idea', 'How about we read a Node book?', 'rayj');
insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (1, 'idea', 'I think we put dippin dots on a task board.', 'sancheza');

insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (2, 'idea', 'I think the raises should go to more deserving UI/UX people.. I mean have you SEEN my UI''s?!', 'cushingb');
insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (2, 'idea', 'You have a point.', 'rayj');
insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (2, 'idea', 'You guys are both crazy, soccer players should make more money...', 'sancheza');
insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (2, 'idea', 'Wait, what?  We are supposed to get paid for this job?!', 'dillons');

insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (3, 'idea', 'Agreed.', 'dillons');
insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (3, 'idea', 'Agreed.', 'cushingb');
insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (3, 'idea', 'Agreed.', 'rayj');
insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (3, 'idea', 'Did i say raise?  I meant one meeeeeeelion dollars', 'sancheza');

insert into comments (parent_id, parent_type, comment_txt, owner) 
	values (4, 'idea', 'Nobody?  Really?', 'dillons');


insert into tag_black_list (tag) values ('noob');


begin
	th_ideas_pkg.vote_on_idea(1, 'cushingb', 'yes');
	th_ideas_pkg.vote_on_idea(1, 'dillons', 'no');
	th_ideas_pkg.vote_on_idea(1, 'sancheza', 'yes');
	th_ideas_pkg.vote_on_idea(1, 'rayj', 'yes');
 	th_ideas_pkg.vote_on_idea(2, 'rayj', 'yes');
 	th_ideas_pkg.vote_on_idea(2, 'cushingb', 'yes');
	th_ideas_pkg.vote_on_idea(2, 'sancheza', 'yes');
	th_ideas_pkg.vote_on_idea(3, 'rayj', 'no');
 	th_ideas_pkg.vote_on_idea(3, 'cushingb', 'yes');
	th_ideas_pkg.vote_on_idea(3, 'sancheza', 'yes');
	th_ideas_pkg.vote_on_idea(4, 'cushingb', 'no');
	th_ideas_pkg.vote_on_idea(4, 'sancheza', 'no');
	th_ideas_pkg.vote_on_idea(4, 'rayj', 'no');
end;
/

begin
	th_topics_pkg.suspend_topic(100, 'dillons');
	th_ideas_pkg.suspend_idea(108, 'cushingb');
	th_ideas_pkg.suspend_idea(109, 'cushingb');
end;
/




commit;
