set define off
create or replace package th_constants_pkg as


	G_USERNAME_MAXLEN 	pls_integer := 250;
	G_TITLE_MAXLEN		pls_integer := 250;
	G_TAG_MAXLEN		pls_integer := 250;
	G_SHORTDESC_MAXLEN	pls_integer := 200;


	---------------------------------------------
	-- GENERIC EXCEPTIONS : -20001..-20099
	---------------------------------------------

	NO_ID_EXCEPTION exception;
	NO_ID_CODE number := -20001;
	NO_ID_MSG varchar2(100) := 'EXCEPTION: Invalid or null ID specified';
	PRAGMA EXCEPTION_INIT(NO_ID_EXCEPTION, -20001);

	NO_TITLE_EXCEPTION exception;
	NO_TITLE_CODE number := -20002;
	NO_TITLE_MSG varchar2(100) := 'EXCEPTION: Invalid or null title specified';
	PRAGMA EXCEPTION_INIT(NO_TITLE_EXCEPTION, -20002);

	NO_UPDATER_EXCEPTION exception;
	NO_UPDATER_CODE number := -20003;
	NO_UPDATER_MSG varchar2(100) := 'EXCEPTION: Invalid or null user specified';
	PRAGMA EXCEPTION_INIT(NO_UPDATER_EXCEPTION, -20003);

	NO_CREATOR_EXCEPTION exception;
	NO_CREATOR_CODE number := -20004;
	NO_CREATOR_MSG varchar2(100) := 'EXCEPTION: Invalid or null user specified as the creator of this object';
	PRAGMA EXCEPTION_INIT(NO_CREATOR_EXCEPTION, -20004);

	FAILED_LOGIN_EXCEPTION exception;
	FAILED_LOGIN_CODE number := -20005;
	FAILED_LOGIN_MSG varchar2(100) := 'EXCEPTION: Invalid or null username specified. Login failed';
	PRAGMA EXCEPTION_INIT(FAILED_LOGIN_EXCEPTION, -20005);


	---------------------------------------------
	-- TOPIC RELATED EXCEPTIONS : -20100..-20199
	---------------------------------------------
	NO_CLOSER_EXCEPTION EXCEPTION;
	NO_CLOSER_CODE number := 20100;
	NO_CLOSER_MSG varchar2(100) := 'EXCEPTION: Invalid or null user specified as closing user';
	PRAGMA EXCEPTION_INIT(NO_CLOSER_EXCEPTION, -20100);

	NO_SUSPENDER_EXCEPTION EXCEPTION;
	NO_SUSPENDER_CODE number := -20101;
	NO_SUSPENDER_MSG varchar2(100) := 'EXCEPTION: Invalid or null user specified as suspending user';
	PRAGMA EXCEPTION_INIT(NO_SUSPENDER_EXCEPTION, -20101);

	NO_REVOKER_EXCEPTION EXCEPTION;
	NO_REVOKER_CODE number := -20102;
	NO_REVOKER_MSG varchar2(100) := 'EXCEPTION: Invalid or null user specified as revoking user';
	PRAGMA EXCEPTION_INIT(NO_REVOKER_EXCEPTION, -20102);
		
	NO_TAGGER_EXCEPTION EXCEPTION;
	NO_TAGGER_CODE number := -20103;
	NO_TAGGER_MSG varchar2(100) := 'EXCEPTION: Invalid or null user specified as tagging user';
	PRAGMA EXCEPTION_INIT(NO_TAGGER_EXCEPTION, -20103);
		
	NO_COMMENTER_EXCEPTION EXCEPTION;
	NO_COMMENTER_CODE number := -20104;
	NO_COMMENTER_MSG varchar2(100) := 'EXCEPTION: Invalid or null user specified as commenting user';
	PRAGMA EXCEPTION_INIT(NO_COMMENTER_EXCEPTION, -20104);
		
	NO_TAG_EXCEPTION EXCEPTION;
	NO_TAG_CODE number := -20105;
	NO_TAG_MSG varchar2(100) := 'EXCEPTION: Invalid or null tag specified';
	PRAGMA EXCEPTION_INIT(NO_TAG_EXCEPTION, -20105);
		
	NO_COMMENT_EXCEPTION EXCEPTION;
	NO_COMMENT_CODE number := -20106;
	NO_COMMENT_MSG varchar2(100) := 'EXCEPTION: Invalid or null comment specified';
	PRAGMA EXCEPTION_INIT(NO_COMMENT_EXCEPTION, -20106);
		

	---------------------------------------------
	-- IDEA RELATED EXCEPTIONS : -20200..-20299
	---------------------------------------------
	NO_SHORTDESC_EXCEPTION EXCEPTION;
	NO_SHORTDESC_CODE number := -20200;
	NO_SHORTDESC_MSG varchar2(100) := 'EXCEPTION: Invalid or null short description specified';
	PRAGMA EXCEPTION_INIT(NO_SHORTDESC_EXCEPTION, -20100);
		
	NO_DESC_EXCEPTION EXCEPTION;
	NO_DESC_CODE number := -20201;
	NO_DESC_MSG varchar2(100) := 'EXCEPTION: Invalid or null description specified';
	PRAGMA EXCEPTION_INIT(NO_DESC_EXCEPTION, -20101);
		
	NO_VOTER_EXCEPTION EXCEPTION;
	NO_VOTER_CODE number := -20202;
	NO_VOTER_MSG varchar2(100) := 'EXCEPTION: Invalid or null voter specified';
	PRAGMA EXCEPTION_INIT(NO_VOTER_EXCEPTION, -20102);
		
	NO_VOTE_EXCEPTION EXCEPTION;
	NO_VOTE_CODE number := -20203;
	NO_VOTE_MSG varchar2(100) := 'EXCEPTION: Invalid or null vote specified';
	PRAGMA EXCEPTION_INIT(NO_VOTE_EXCEPTION, -20103);

	ALREADY_TRACKED_EXCEPTION EXCEPTION;
	ALREADY_TRACKED_CODE number := -20204;
	ALREADY_TRACKED_MSG varchar2(100) := 'EXCEPTION: This tracking user is already tracking this idea';
	PRAGMA EXCEPTION_INIT(ALREADY_TRACKED_EXCEPTION, -20104);

	ALREADY_IGNORED_EXCEPTION EXCEPTION;
	ALREADY_IGNORED_CODE number := -20205;
	ALREADY_IGNORED_MSG varchar2(100) := 'EXCEPTION: This user is already ignoring this idea';
	PRAGMA EXCEPTION_INIT(ALREADY_IGNORED_EXCEPTION, -20105);

		

	---------------------------------------------
	-- COMMENT RELATED EXCEPTIONS : -20300..-20399
	---------------------------------------------
	NO_PARENT_ID_EXCEPTION EXCEPTION;
	NO_PARENT_ID_CODE number := -20300;
	NO_PARENT_ID_MSG varchar2(100) := 'blah';
	PRAGMA EXCEPTION_INIT(NO_PARENT_ID_EXCEPTION, -20300);
		
	INVALID_PARENT_TYPE_EXCEPTION EXCEPTION;
	INVALID_PARENT_TYPE_CODE number := -20300;
	INVALID_PARENT_TYPE_MSG varchar2(100) := 'EXCEPTION: Invalid or null parent type specified for the source object to be commented on';
	PRAGMA EXCEPTION_INIT(NO_PARENT_ID_EXCEPTION, -20300);
		

end th_constants_pkg;
/
show errors



create or replace package body th_constants_pkg as


end th_constants_pkg;
/
show errors



