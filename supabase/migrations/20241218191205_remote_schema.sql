create type "public"."affiliate_type" as enum ('sign_up', 'purchase');

create table "public"."affiliate" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "referer_id" uuid,
    "type" affiliate_type default 'sign_up'::affiliate_type,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."affiliate" enable row level security;

create table "public"."promotional_codes" (
    "id" text not null default gen_random_uuid(),
    "coupon_id" text not null,
    "code" text,
    "referer_id" uuid,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."promotional_codes" enable row level security;

alter table "public"."subscriptions" add column "promotional_code" text;

CREATE UNIQUE INDEX affiliate_pkey ON public.affiliate USING btree (id);

CREATE UNIQUE INDEX promotional_codes_pkey ON public.promotional_codes USING btree (id);

alter table "public"."affiliate" add constraint "affiliate_pkey" PRIMARY KEY using index "affiliate_pkey";

alter table "public"."promotional_codes" add constraint "promotional_codes_pkey" PRIMARY KEY using index "promotional_codes_pkey";

alter table "public"."affiliate" add constraint "affiliate_referer_id_fkey" FOREIGN KEY (referer_id) REFERENCES profiles(id) not valid;

alter table "public"."affiliate" validate constraint "affiliate_referer_id_fkey";

alter table "public"."affiliate" add constraint "affiliate_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."affiliate" validate constraint "affiliate_user_id_fkey";

alter table "public"."promotional_codes" add constraint "promotional_codes_referer_id_fkey" FOREIGN KEY (referer_id) REFERENCES profiles(id) not valid;

alter table "public"."promotional_codes" validate constraint "promotional_codes_referer_id_fkey";

grant delete on table "public"."affiliate" to "anon";

grant insert on table "public"."affiliate" to "anon";

grant references on table "public"."affiliate" to "anon";

grant select on table "public"."affiliate" to "anon";

grant trigger on table "public"."affiliate" to "anon";

grant truncate on table "public"."affiliate" to "anon";

grant update on table "public"."affiliate" to "anon";

grant delete on table "public"."affiliate" to "authenticated";

grant insert on table "public"."affiliate" to "authenticated";

grant references on table "public"."affiliate" to "authenticated";

grant select on table "public"."affiliate" to "authenticated";

grant trigger on table "public"."affiliate" to "authenticated";

grant truncate on table "public"."affiliate" to "authenticated";

grant update on table "public"."affiliate" to "authenticated";

grant delete on table "public"."affiliate" to "service_role";

grant insert on table "public"."affiliate" to "service_role";

grant references on table "public"."affiliate" to "service_role";

grant select on table "public"."affiliate" to "service_role";

grant trigger on table "public"."affiliate" to "service_role";

grant truncate on table "public"."affiliate" to "service_role";

grant update on table "public"."affiliate" to "service_role";

grant delete on table "public"."promotional_codes" to "anon";

grant insert on table "public"."promotional_codes" to "anon";

grant references on table "public"."promotional_codes" to "anon";

grant select on table "public"."promotional_codes" to "anon";

grant trigger on table "public"."promotional_codes" to "anon";

grant truncate on table "public"."promotional_codes" to "anon";

grant update on table "public"."promotional_codes" to "anon";

grant delete on table "public"."promotional_codes" to "authenticated";

grant insert on table "public"."promotional_codes" to "authenticated";

grant references on table "public"."promotional_codes" to "authenticated";

grant select on table "public"."promotional_codes" to "authenticated";

grant trigger on table "public"."promotional_codes" to "authenticated";

grant truncate on table "public"."promotional_codes" to "authenticated";

grant update on table "public"."promotional_codes" to "authenticated";

grant delete on table "public"."promotional_codes" to "service_role";

grant insert on table "public"."promotional_codes" to "service_role";

grant references on table "public"."promotional_codes" to "service_role";

grant select on table "public"."promotional_codes" to "service_role";

grant trigger on table "public"."promotional_codes" to "service_role";

grant truncate on table "public"."promotional_codes" to "service_role";

grant update on table "public"."promotional_codes" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."affiliate"
as permissive
for insert
to public
with check (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT auth.uid() AS uid) = referer_id)));


create policy "Enable users to view their own data only"
on "public"."affiliate"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT auth.uid() AS uid) = referer_id)));


create policy "Enable users to view their own data only"
on "public"."promotional_codes"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = referer_id));



