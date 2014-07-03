col short_desc for a30 word_wrapped

select i.id, i.short_desc, nvl(v.vote,'none') vote
  from ideas i, votes v
 where i.id = v.idea_id (+)
   and nvl(v.vote,'none') = 'none'
/
