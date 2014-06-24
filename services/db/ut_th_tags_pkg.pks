set define off

create or replace package irate_tags_pkg_test
is

	procedure ut_setup;
	procedure ut_teardown;

	procedure ut_newtag_tagisnotnull;
	procedure ut_newtag_ownerlasteditedby;
	procedure ut_newtag_lasteditedistoday;
	procedure ut_newtag_revokedisnull;
	procedure ut_newtag_difffromsecondtag;
	procedure ut_newtag_failsonsametag;

end irate_tags_pkg_test;
/
show errors

set define on
