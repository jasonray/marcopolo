--create index comment_ctx_idx on comments(comment_txt) indextype is ctxsys.context;
--create index idea_short_desc_ctx_idx on ideas(short_desc) indextype is ctxsys.context;
--create index idea_long_desc_ctx_idx on ideas(description) indextype is ctxsys.context;
--create index topic_title_ctx_idx on topics(title) indextype is ctxsys.context;
--create index topic_desc_ctx_idx on topics(description) indextype is ctxsys.context;


create or replace procedure th_refresh_context_idx
is
begin
  ctxsys.ctx_ddl.sync_index('TH.COMMENT_CTX_IDX');
  ctxsys.ctx_ddl.sync_index('TH.IDEA_SHORT_DESC_CTX_IDX');
  ctxsys.ctx_ddl.sync_index('TH.IDEA_LONG_DESC_CTX_IDX');
  ctxsys.ctx_ddl.sync_index('TH.TOPIC_TITLE_CTX_IDX');
  ctxsys.ctx_ddl.sync_index('TH.TOPIC_DESC_CTX_IDX');
end;
/
show errors

begin th_refresh_context_idx; end;
/
