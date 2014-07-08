set lines 180
col owner for a20
col short_desc for a40
col topic_title for a30
col tags for a45 word_wrapped
col created for a25
col comment_count for 99
col tags for a30
col rn for 99

select i.id, t.id topic_id, t.title topic_title, i.short_desc,
       i.created, c.comment_count, rownum rn
  from ideas i, topics t, idea_tags it,
       (select count(*) comment_count, parent_id
         from comments
        where parent_type = 'idea'
        group by parent_id) c,
       (select idea_id, listagg(it.tag, ' ') within group (order by it.tag) tags
          from idea_tags it
         group by idea_id ) ta
 where i.id = c.parent_id (+)
   and i.topic_id = t.id (+)
   and i.id = ta.idea_id (+)
/
