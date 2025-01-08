create type "public"."organization_invitation_status" as enum ('active', 'accepted', 'declined', 'inactive');

create table "public"."organization_invitations" (
    "id" uuid not null default gen_random_uuid(),
    "inviter_user_id" uuid not null,
    "status" organization_invitation_status not null default 'active'::organization_invitation_status,
    "invited_user_email" text not null,
    "organization_id" uuid not null,
    "invited_user_role" organization_member_role not null default 'member'::organization_member_role,
    "invited_user_id" uuid,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."organization_invitations" enable row level security;

CREATE UNIQUE INDEX organization_invitations_pkey ON public.organization_invitations USING btree (id);

alter table "public"."organization_invitations" add constraint "organization_invitations_pkey" PRIMARY KEY using index "organization_invitations_pkey";

alter table "public"."organization_invitations" add constraint "organization_invitations_invited_user_id_fkey" FOREIGN KEY (invited_user_id) REFERENCES profiles(id) not valid;

alter table "public"."organization_invitations" validate constraint "organization_invitations_invited_user_id_fkey";

alter table "public"."organization_invitations" add constraint "organization_invitations_inviter_user_id_fkey" FOREIGN KEY (inviter_user_id) REFERENCES profiles(id) not valid;

alter table "public"."organization_invitations" validate constraint "organization_invitations_inviter_user_id_fkey";

alter table "public"."organization_invitations" add constraint "organization_invitations_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid;

alter table "public"."organization_invitations" validate constraint "organization_invitations_organization_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_organization_members(org_id uuid, search text DEFAULT NULL::text)
 RETURNS TABLE(organization_id uuid, user_id uuid, username text, picture_url text, phone text, email text, role text, user_status text, invitation_id text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    SELECT *
    FROM public.organization_members_view
    WHERE organization_id = org_id
      AND (
          search IS NULL OR
          username ILIKE '%' || search || '%' OR
          email ILIKE '%' || search || '%'
      );
$function$
;

create or replace view "public"."organization_invitations_view" as  SELECT oi.id AS invitation_id,
    oi.inviter_user_id,
    inviter.username AS inviter_username,
    inviter.email AS inviter_email,
    inviter.picture_url AS inviter_picture_url,
    oi.invited_user_email,
    oi.invited_user_role,
    oi.status AS invitation_status,
    oi.organization_id,
    org.name AS organization_name,
    org.slug AS organization_slug,
    org.image_url AS organization_image_url,
    oi.invited_user_id,
    invited.username AS invited_username,
    invited.email AS invited_email,
    invited.picture_url AS invited_picture_url,
    oi.created_at,
    COALESCE(member_counts.member_count, (0)::bigint) AS organization_member_count
   FROM ((((organization_invitations oi
     LEFT JOIN profiles inviter ON ((oi.inviter_user_id = inviter.id)))
     LEFT JOIN profiles invited ON ((oi.invited_user_id = invited.id)))
     LEFT JOIN organizations org ON ((oi.organization_id = org.id)))
     LEFT JOIN ( SELECT organization_members.organization_id,
            count(organization_members.user_id) AS member_count
           FROM organization_members
          GROUP BY organization_members.organization_id) member_counts ON ((oi.organization_id = member_counts.organization_id)));

ALTER VIEW public.organization_invitations_view SET (security_invoker = true);

create or replace view "public"."organization_members_view" as  SELECT om.organization_id,
    om.user_id,
    p.username,
    p.picture_url,
    p.phone,
    p.email,
    om.role,
    'member'::text AS user_status,
    NULL::uuid AS invitation_id,
    om.created_at,
    om.updated_at
   FROM (organization_members om
     JOIN profiles p ON ((om.user_id = p.id)))
UNION ALL
 SELECT oi.organization_id,
    oi.invited_user_id AS user_id,
    p.username,
    p.picture_url,
    p.phone,
    oi.invited_user_email AS email,
    oi.invited_user_role AS role,
    'invited'::text AS user_status,
    oi.id AS invitation_id,
    oi.created_at,
    NULL::timestamp with time zone AS updated_at
   FROM (organization_invitations oi
     LEFT JOIN profiles p ON ((oi.invited_user_id = p.id)))
  WHERE (oi.status = 'active'::organization_invitation_status);

ALTER VIEW public.organization_members_view SET (security_invoker = true);

grant delete on table "public"."organization_invitations" to "anon";

grant insert on table "public"."organization_invitations" to "anon";

grant references on table "public"."organization_invitations" to "anon";

grant select on table "public"."organization_invitations" to "anon";

grant trigger on table "public"."organization_invitations" to "anon";

grant truncate on table "public"."organization_invitations" to "anon";

grant update on table "public"."organization_invitations" to "anon";

grant delete on table "public"."organization_invitations" to "authenticated";

grant insert on table "public"."organization_invitations" to "authenticated";

grant references on table "public"."organization_invitations" to "authenticated";

grant select on table "public"."organization_invitations" to "authenticated";

grant trigger on table "public"."organization_invitations" to "authenticated";

grant truncate on table "public"."organization_invitations" to "authenticated";

grant update on table "public"."organization_invitations" to "authenticated";

grant delete on table "public"."organization_invitations" to "service_role";

grant insert on table "public"."organization_invitations" to "service_role";

grant references on table "public"."organization_invitations" to "service_role";

grant select on table "public"."organization_invitations" to "service_role";

grant trigger on table "public"."organization_invitations" to "service_role";

grant truncate on table "public"."organization_invitations" to "service_role";

grant update on table "public"."organization_invitations" to "service_role";

create policy "Enable insert for admin users only"
on "public"."organization_invitations"
as permissive
for insert
to authenticated
with check (is_organization_admin_or_owner(organization_id));


create policy "Enable organization users to view"
on "public"."organization_invitations"
as permissive
for select
to authenticated
using ((is_organization_member(organization_id) OR (invited_user_id = auth.uid())));


create policy "Enable update for admin users"
on "public"."organization_invitations"
as permissive
for update
to public
using ((is_organization_admin_or_owner(organization_id) OR (invited_user_id = auth.uid())));


create policy "Enable admin to remove user"
on "public"."organization_members"
as permissive
for delete
to public
using (is_organization_admin_or_owner(organization_id));



