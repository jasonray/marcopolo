col short_desc for a40 word_wrapped

select i.id, i.short_desc
  from ideas i
 where i.id not in (select distinct idea_id
                      from votes
                     where voter = 'dillons');
