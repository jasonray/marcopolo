set lines 220

col topic_id for 999
col topic_title for a40
col owner for a20
col short_desc for a40
col description for a40
col tags for a45 word_wrapped
col created for a25
col comment_count for 99
col tags for a30
col rn for 99

prompt ..IDEAS
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
                           where i.topic_id = t.id(+) 
                             and c.parent_id(+) = i.id 
                             and i.id = t.idea_id(+) ) x ) a  
          where rownum <= 4 ) 
 where rnum >= 1
   and id not in (select distinct idea_id from votes where voter = 'dillons' union all
                  select idea_id from ignored_ideas where ignoring_user = 'dillons')
/


prompt ..TRACKED IDEAS
select *  
  from ( select rownum rnum, a.* 
           from ( select x.id, x.owner, x.topic_id, x.topic_title, x.short_desc, x.description, 
                         x.created, x.comment_count, x.tags, x.rn 
                    from (select i.id, i.owner, t.id topic_id, t.title topic_title, i.short_desc, 
                                 i.description, i.created, c.comment_count, rownum rn, t.tags   
                            from ideas i, topics t, tracked_ideas ti,
                                 (select count(*) comment_count, parent_id 
                                    from comments 
                                   where parent_type = 'idea' 
                                   group by parent_id) c, 
                                 (select it.idea_id,  
                                         listagg(it.tag, ' ') within group (order by it.tag) tags 
                                    from idea_tags it 
                                   group by it.idea_id) t 
                           where i.topic_id = t.id(+) 
                             and c.parent_id(+) = i.id 
                             and i.id = t.idea_id(+)
                             and i.id = ti.idea_id
                             and ti.tracking_user = 'dillons' ) x ) a  
          where rownum <= 4 ) 
 where rnum >= 1
/


prompt ..MY IDEAS
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
          where rownum <= 4 ) 
 where rnum >= 1
/


prompt ..PAST IDEAS
// past = ideas that are closed + ideas i have voted on but are not yet closed
// ordered by open then closed, then date
select *  
  from ( select rownum rnum, a.* 
           from ( select x.id, x.owner, x.topic_id, x.topic_title, x.short_desc, x.description, 
                         x.created, x.comment_count, x.tags, x.rn 
                    from (select i.id, i.owner, t.id topic_id, t.title topic_title, i.short_desc,
                                 i.description, i.created, i.closed, c.comment_count, ta.tags, rownum rn
                            from ideas i, topics t,
                                 (select count(*) comment_count, parent_id
                                    from comments
                                   where parent_type = 'idea'
                                   group by parent_id) c,
                                 (select it.idea_id,
                                         listagg(it.tag, ' ') within group (order by it.tag) tags
                                    from idea_tags it
                                   group by it.idea_id) ta
                           where t.id (+) = i.topic_id
                             and i.id = c.parent_id (+)
                             and i.id = ta.idea_id (+)
                             and (i.closed is not null or
                                  i.id in (select idea_id from votes where voter = 'dillons'))) x ) a
          where rownum <= 4 ) 
 where rnum >= 1
/

