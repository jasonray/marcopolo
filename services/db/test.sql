drop table x2;
create table x2 ( a clob );

create or replace package t as
	procedure test (p_val in clob default null);
end t;
/

create or replace package body t as

	procedure test (p_val in clob default null)
	is
  		l_val clob := p_val;
	begin
		insert into x2 values (nvl(l_val,'x'));	
	end test;

end t;
/
show errors

begin
  t.test;
  t.test('z');
end;
/

select * from x2;
