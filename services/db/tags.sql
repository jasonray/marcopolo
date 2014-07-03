col tag for a25
col tag_count for 999

select x.tag, sum(cnt) tag_count
  from (select it.tag, count(it.tag) cnt
          from idea_tags it
         where it.tagged > sysdate-30
         group by it.tag
        union all
        select tt.tag, count(tt.tag) cnt
          from topic_tags tt
         where tt.tagged > sysdate-30
         group by tt.tag) x
 group by x.tag
 order by sum(cnt) desc
/
