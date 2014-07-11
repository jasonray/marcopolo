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
col vote for a4
col tracked for a4
col rn for 99

prompt ..NEW IDEAS FOR VOTING
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
                             and i.id = t.idea_id(+)
                             and ( contains (i.short_desc, th_parser.simpleSearch('"Friday afternoon" +NODE')) > 0 
                                or contains (i.description, th_parser.simpleSearch('"Friday afternoon" +NODE')) > 0 ) ) x ) a  
          where rownum <= 25 ) 
 where rnum >= 1
   and id not in (select distinct idea_id from votes where voter = 'dillons' union all
                  select idea_id from ignored_ideas where ignoring_user = 'dillons')
/


prompt ..GET IDEAS W? CONTEXT
select id, short_desc
  from ideas
 where contains (description, th_parser.simpleSearch('"Friday afternoon" +NODE')) > 0
/
