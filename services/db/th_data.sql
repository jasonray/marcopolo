-- insert users
insert into users (username) values ('dillons');
insert into users (username) values ('cushingb');
insert into users (username) values ('rayj');
insert into users (username) values ('sancheza');

-- insert ideas
insert into ideas (id, short_desc, owner, available) 
	values (1, 'How about we have dippin'' dots on Friday afternoons?', 'cushingb', sysdate);
insert into ideas (short_desc, owner, available) 
	values ('I believe all UI/UX designers should get a raise.', 'cushingb', sysdate);
insert into ideas (short_desc, owner, available) 
	values ('Foosball should be a required activity during the day.', 'cushingb', sysdate);

insert into ideas (id, short_desc, owner, available) 
	values (2, 'I believe all NODE developers should get a raise.', 'rayj', sysdate);
insert into ideas (short_desc, owner, available) 
	values ('I think we should use NODE for every and all projects from now on at Agilex.', 'rayj', sysdate);
insert into ideas (short_desc, owner, available) 
	values ('How about we get together for carrot cake on Thursday mornings?', 'rayj', sysdate);

insert into ideas (id, short_desc, owner, available) 
	values (3, 'I believe all scrum masters should get a raise.', 'sancheza', sysdate);
insert into ideas (short_desc, owner, available) 
	values ('I think we should use Target Process for every and all projects from now on at Agilex.', 'sancheza', sysdate);
insert into ideas (short_desc, owner, available) 
	values ('How about we get together for soccer on Wednesday nights?', 'sancheza', sysdate);


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


insert into tag_black_list (tag) values ('noob');




commit;
