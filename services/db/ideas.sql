set lines 180
col owner for a20
col short_desc for a40
col description for a40
col tags for a45 word_wrapped
col created for a25
col comment_count for 99
col tags for a30
col rn for 99

prompt ..IDEAS
select i.id, i.topic_id, i.owner, substr(i.short_desc,1,40) short_desc,
       listagg(it.tag, ' ') within group (order by it.tag) tags      
  from ideas i, idea_tags it
 where it.idea_id (+) = i.id
 group by i.id, i.topic_id, i.owner, i.short_desc
 order by i.id
/


prompt ..MORE IDEAS
select x.id, substr(x.short_desc,1,40) short_desc, 
       x.created, x.comment_count, x.tags, x.rn
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
           where c.parent_id (+) = i.id
             and i.id = t.idea_id (+) ) x 
/
