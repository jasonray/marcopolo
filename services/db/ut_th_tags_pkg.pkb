set define off

create or replace package body irate_tags_pkg_test
is

	procedure ut_setup
	is
	begin
		null;
	end ut_setup;

	procedure ut_teardown
	is
	begin
		null;
	end ut_teardown;



	procedure ut_newtag_tagisnotnull
	is
		l_tag tags%rowtype;
		l_tagval tags.tag%type := 'noblegas';
	begin
		l_tag := irate_tags_pkg.create_tag(l_tagval, 'sdillon');
		utassert.eq ('New tag is not null', l_tag.tag, l_tagval);
	end;

	procedure ut_newtag_ownerlasteditedby
	is
	begin
		null;
	end;

	procedure ut_newtag_lasteditedistoday
	is
	begin
		null;
	end;

	procedure ut_newtag_revokedisnull
	is
	begin
		null;
	end;

	procedure ut_newtag_difffromsecondtag
	is
	begin
		null;
	end;

	procedure ut_newtag_failsonsametag
	is
	begin
		null;
	end;



end irate_tags_pkg_test;
/
show errors


set define on
