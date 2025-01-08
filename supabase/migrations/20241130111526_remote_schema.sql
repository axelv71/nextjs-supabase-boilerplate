grant delete on table "storage"."s3_multipart_uploads" to "postgres";

grant insert on table "storage"."s3_multipart_uploads" to "postgres";

grant references on table "storage"."s3_multipart_uploads" to "postgres";

grant select on table "storage"."s3_multipart_uploads" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads" to "postgres";

grant update on table "storage"."s3_multipart_uploads" to "postgres";

grant delete on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant insert on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant references on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant select on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant update on table "storage"."s3_multipart_uploads_parts" to "postgres";

create policy "Allow READ for organization members 1xtprl6_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'organizations_logo'::text) AND (EXISTS ( SELECT 1
   FROM organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.organization_id = (split_part(storage.filename(objects.name), '.'::text, 1))::uuid) AND (organization_members.role = ANY (ARRAY['member'::organization_member_role, 'admin'::organization_member_role, 'owner'::organization_member_role])))))));


create policy "Allow WRITE Access to organization owner and admin 1xtprl6_0"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'organizations_logo'::text) AND (EXISTS ( SELECT 1
   FROM organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.organization_id = (split_part(storage.filename(objects.name), '.'::text, 1))::uuid) AND (organization_members.role = ANY (ARRAY['admin'::organization_member_role, 'owner'::organization_member_role])))))));


create policy "Allow WRITE Access to organization owner and admin 1xtprl6_1"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'organizations_logo'::text) AND (EXISTS ( SELECT 1
   FROM organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.organization_id = (split_part(storage.filename(objects.name), '.'::text, 1))::uuid) AND (organization_members.role = ANY (ARRAY['admin'::organization_member_role, 'owner'::organization_member_role])))))));


create policy "Allow WRITE Access to organization owner and admin 1xtprl6_2"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'organizations_logo'::text) AND (EXISTS ( SELECT 1
   FROM organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.organization_id = (split_part(storage.filename(objects.name), '.'::text, 1))::uuid) AND (organization_members.role = ANY (ARRAY['admin'::organization_member_role, 'owner'::organization_member_role])))))));



