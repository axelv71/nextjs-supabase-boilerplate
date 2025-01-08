create table "public"."onboarding" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "values" json
);


alter table "public"."onboarding" enable row level security;

CREATE UNIQUE INDEX onboarding_pkey ON public.onboarding USING btree (id);

alter table "public"."onboarding" add constraint "onboarding_pkey" PRIMARY KEY using index "onboarding_pkey";

alter table "public"."onboarding" add constraint "onboarding_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."onboarding" validate constraint "onboarding_id_fkey";

grant delete on table "public"."onboarding" to "anon";

grant insert on table "public"."onboarding" to "anon";

grant references on table "public"."onboarding" to "anon";

grant select on table "public"."onboarding" to "anon";

grant trigger on table "public"."onboarding" to "anon";

grant truncate on table "public"."onboarding" to "anon";

grant update on table "public"."onboarding" to "anon";

grant delete on table "public"."onboarding" to "authenticated";

grant insert on table "public"."onboarding" to "authenticated";

grant references on table "public"."onboarding" to "authenticated";

grant select on table "public"."onboarding" to "authenticated";

grant trigger on table "public"."onboarding" to "authenticated";

grant truncate on table "public"."onboarding" to "authenticated";

grant update on table "public"."onboarding" to "authenticated";

grant delete on table "public"."onboarding" to "service_role";

grant insert on table "public"."onboarding" to "service_role";

grant references on table "public"."onboarding" to "service_role";

grant select on table "public"."onboarding" to "service_role";

grant trigger on table "public"."onboarding" to "service_role";

grant truncate on table "public"."onboarding" to "service_role";

grant update on table "public"."onboarding" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."onboarding"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Enable read access for user based on ID"
on "public"."onboarding"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = id));




