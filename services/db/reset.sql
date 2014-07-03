begin
	th_ideas_pkg.reset_idea(999);
	for i in (select * from ideas where short_desc like 'Some%') loop
		th_ideas_pkg.reset_idea(i.id);
		delete from ideas where id = i.id;
	end loop;
end;
/

commit;
