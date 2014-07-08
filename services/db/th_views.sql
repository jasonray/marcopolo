create or replace view get_ideas as
select * 
  from ( select rownum rnum, a.*
           from ( select x.id, x.short_desc, x.description, x.created, x.comment_count, x.tags, x.rn
                    from (select i.id, i.short_desc, i.description, i.created, c.comment_count, rownum rn,
                                 t.tags
                            from ideas i,
                                 (select count(*) comment_count, parent_id
                                    from comments
                                   where parent_type = 'idea'
	                           group by parent_id) c,
                                 (select it.idea_id, 
                                         listagg(it.tag, ' ') within group (order by it.tagged) tags
                                    from idea_tags it
                                   group by it.idea_id) t
                           where c.parent_id = i.id
                             and i.id = t.idea_id ) x ) a
          where rownum <= 4 )
 where rnum >= 2;


create or replace view get_new_ideas as
select * 
  from ( select rownum rnum, a.*
           from ( select x.id, x.short_desc, x.description, x.created, x.comment_count, x.tags, x.rn
                    from (select i.id, i.short_desc, i.description, i.created, c.comment_count, rownum rn,
                                 t.tags
                            from ideas i,
                                 (select count(*) comment_count, parent_id
                                    from comments
                                   where parent_type = 'idea'
	                           group by parent_id) c,
                                 (select it.idea_id, 
                                         listagg(it.tag, ' ') within group (order by it.tagged) tags
                                    from idea_tags it
                                   group by it.idea_id) t
                           where c.parent_id = i.id
                             and i.id = t.idea_id
                             and v.idea_id (+) = i.id ) x ) a
          where rownum <= 4 )
 where rnum >= 2;

select * from get_new_ideas;


create or replace view my_ideas_view as
select *
  from ( select rownum rnum, a.*
           from ( select x.id, x.owner, x.topic_id, x.topic_title, x.short_desc, x.description,
                         x.created, x.comment_count, x.tags, x.rn
                    from (select i.id, i.owner, t.id topic_id, t.title topic_title, i.short_desc,
                                 i.description, i.created, c.comment_count, rownum rn, t.tags
                            from ideas i, topics t,
                                 (select count(*) comment_count, parent_id
                                    from comments
                                   where parent_type = 'idea'
                                   group by parent_id) c,
                                 (select it.idea_id,
                                         listagg(it.tag, ' ') within group (order by it.tag) tags
                                    from idea_tags it
                                   group by it.idea_id) t
                           where i.owner = 'dillons'
                             and i.topic_id = t.id(+)
                             and c.parent_id(+) = i.id
                             and i.id = t.idea_id(+) ) x ) a
          where rownum <= 25 )
 where rnum >= 1
/
select * from my_ideas_view;

