-- setup database objects
@th_ddl.sql
@th_trig.sql
@th_constants_pkg.sql
@th_tags_pkg.sql
@th_comments_pkg.sql
@th_topics_pkg.sql
@th_ideas_pkg.sql
@th_views.sql
@th_acl.sql
@th_auth_pkg.sql

-- insert sample data
@th_data.sql

-- build text indexes
@th_context

-- perform unit testing
--@ut_th_ideas_pks.sql
--@ut_th_ideas_pkb.sql
--@ut_th_comments_pks.sql
--@ut_th_comments_pkb.sql
--@ut_th_tags_pkg.pks
--@ut_th_tags_pkg.pkb
--@ut_th_topics_pkg.pks
--@ut_th_topics_pkg.pkb

