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
          where rownum <= 6 )
 where rnum >= 2
   and id not in (select distinct idea_id from votes where voter = 'dillons')
/

