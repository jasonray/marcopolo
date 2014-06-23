set define off

create or replace package th_topics_pkg_test
is

	procedure ut_setup;
	procedure ut_teardown;

	procedure ut_new;
	procedure ut_new_notitle;
	procedure ut_new_noowner;
	procedure ut_upd_notitle;
	procedure ut_upd_noupdater;

end ut_topics_pkg_test;
/
show errors

set define on
