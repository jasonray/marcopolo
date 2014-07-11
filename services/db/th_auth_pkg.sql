set define off
create or replace package th_auth_pkg as

	G_APP_TOKEN varchar2(50) := '8652E26C03B81112524D74D1A72BF49CD3BACA00';

	----------------------------------------------
	-- login a user
	----------------------------------------------
	procedure login_user (p_username 	users.username%type,
			      p_password 	varchar2,
			      p_token		out	users.token%type,
			      p_username_out	out	users.username%type,
			      p_first_name	out	users.first_name%type,
			      p_last_name	out	users.last_name%type,
			      p_email		out	users.email%type);

	function login_user (p_username 	users.username%type,
			     p_password 	varchar2) 
		return users.token%type;


	----------------------------------------------
	-- authenticate that a user, token combination is correct
	----------------------------------------------
	procedure auth_user (p_username		users.username%type,
			     p_token		users.token%type);

	function auth_user (p_username		users.username%type,
			    p_token		users.token%type) return boolean;

end th_auth_pkg;
/
show errors



create or replace package body th_auth_pkg as

	---------------------------------------------
	-- login a user
	---------------------------------------------
        procedure login_user (p_username        users.username%type,
                              p_password        varchar2,
			      p_token		out	users.token%type,
			      p_username_out	out	users.username%type,
			      p_first_name	out	users.first_name%type,
			      p_last_name	out	users.last_name%type,
			      p_email		out	users.email%type)
	is
	begin
		p_token := login_user(p_username, p_password);		
		--
		if p_token is not null then
			select username, first_name, last_name, email
			  into p_username_out, p_first_name, p_last_name, p_email
			  from users
			 where username = p_username
			   and token = p_token;
		end if;
	end login_user;

	function login_user (p_username 	users.username%type,
			     p_password 	varchar2) 
		return users.token%type
	is
		l_token varchar2(100);
		l_first	users.first_name%type;
		l_last	users.last_name%type;
		l_email	users.email%type;
		l_cnt	pls_integer := 0;
	begin
		--l_token := login@auth(G_APP_TOKEN, p_username, p_password);
		l_token := login@auth(p_app_id 	=> G_APP_TOKEN,
					p_uid 	=> p_username,
					p_pw 	=> p_password,
					p_fname => l_first,
					p_lname => l_last,
					p_email => l_email);
		--
		if l_token is null then 
			raise_application_error(th_constants_pkg.FAILED_LOGIN_CODE,
						th_constants_pkg.FAILED_LOGIN_MSG);
		end if;
		--
		select count(*) into l_cnt from users where lower(username) = lower(p_username);
		--
		if l_cnt = 0 then
			insert into users (username, token, first_name, last_name, email)
		 	values (lower(p_username), l_token, l_first, l_last, l_email); 
 		else
			update users
		   	   set token = l_token
		 	 where username = p_username;
		end if;
		--
		return l_token;
	end login_user;


	---------------------------------------------
	-- authenticate that a user, token combination is correct
	---------------------------------------------
	procedure auth_user (p_username		users.username%type,
		 	     p_token		users.token%type) 
	is
	begin
		if not auth_user(p_username, p_token) then
			raise_application_error(th_constants_pkg.FAILED_LOGIN_CODE,
						th_constants_pkg.FAILED_LOGIN_MSG);
		end if;
	end auth_user;

	function auth_user (p_username		users.username%type,
			    p_token		users.token%type) return boolean
	is
	begin
		if agilex.auth.verify@auth(p_app_id => G_APP_TOKEN,
                        		   p_userid => 'dillons',
                        		   p_token => p_token) then
			update users set token = p_token where username = p_username;
			return true;
		end if;
		raise_application_error(th_constants_pkg.FAILED_LOGIN_CODE,
					th_constants_pkg.FAILED_LOGIN_MSG);
	end auth_user;
	

end th_auth_pkg;
/
show errors

