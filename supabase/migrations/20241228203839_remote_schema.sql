create policy "Allow users to see only their data 1oj01fe_0"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'avatars'::text) AND (auth.uid() = (split_part(storage.filename(name), '.'::text, 1))::uuid)));


create policy "Allow users to see only their data 1oj01fe_1"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'avatars'::text) AND (auth.uid() = (split_part(storage.filename(name), '.'::text, 1))::uuid)));


create policy "Allow users to see only their data 1oj01fe_2"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'avatars'::text) AND (auth.uid() = (split_part(storage.filename(name), '.'::text, 1))::uuid)));


create policy "Public access for read 1oj01fe_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));



