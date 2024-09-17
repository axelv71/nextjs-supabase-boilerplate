---
--- Functions
---

-- Function to update the updated_at timestamp
create function update_timestamp()
returns trigger
language plpgsql
as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$;

--
-- Create a table to store user profiles
--

-- Create a table to store user profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  username text,
  picture_url text,
  email text not null,

  primary key (id)
);

alter table public.profiles enable row level security;

-- Enable user to read their own profile
create policy "Allow user to read their own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

-- Enable user to update their own profile
create policy "Allow user to update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

-- Inserts a row into public.profiles and creates an organization with a custom slug
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  new_organization_id uuid;
  random_suffix text;
  generated_slug text;
  sanitized_username text;
begin
  -- Step 1: Insert the new user profile
  insert into public.profiles (id, username, picture_url, email)
  values (new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'picture', new.email);

  -- Step 2: Sanitize the username by replacing spaces with dashes
  sanitized_username := lower(replace(new.raw_user_meta_data ->> 'name', ' ', '-'));

  -- Step 3: Generate a 6-character random string for the slug
  random_suffix := substring(md5(random()::text), 1, 6);

  -- Step 4: Create the slug with the format: "nom-utilisateur-[6 caractères aléatoires]-org"
  generated_slug := sanitized_username || '-' || random_suffix || '-org';

  -- Step 5: Create a new organization for the user with the generated slug
  insert into public.organizations (name, slug, image_url)
  values (new.raw_user_meta_data ->> 'name' || ' Organization', generated_slug, new.raw_user_meta_data ->> 'picture')
  returning id into new_organization_id;

  -- Step 6: Add the user to the newly created organization as the owner
  insert into public.organization_members (organization_id, user_id, role)
  values (new_organization_id, new.id, 'owner');

  return new;
end;
$$;

-- Trigger to call handle_new_user when a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

--
-- Organizations
--

-- Create a table to store organization information
create table public.organizations (
    id uuid not null default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    image_url text,

    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),

    primary key (id)
);

alter table public.organizations enable row level security;

-- Automatically set the updated_at column to the current time when the row is updated
create trigger update_organizations_updated_at
before update on public.organizations
for each row
execute procedure update_timestamp();


--
-- Organizations Members
--

-- Create enum for organization member roles
create type public.organization_member_role as enum (
    'owner', -- Can manage organization settings and members
    'admin', -- Can manage organization settings
    'member' -- Can view organization information
);

-- Create a table to store organization members
create table public.organization_members (
    organization_id uuid not null references public.organizations(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role public.organization_member_role not null default 'member',

    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),

    primary key (organization_id, user_id)
);

alter table public.organization_members enable row level security;

-- Automatically set the updated_at column to the current time when the row is updated
create trigger update_organization_members_updated_at
before update on public.organization_members
for each row
execute procedure update_timestamp();

-- Enable organization owner to manage members
create policy "Allow organization owner to manage members"
  on public.organization_members for all
  using (exists (select 1 from public.organization_members
                 where user_id = auth.uid()
                   and organization_id = public.organization_members.organization_id
                   and role = 'owner'));

-- Enable organization admin to manage members
create policy "Allow organization admin to manage members"
on public.organization_members for all
using (exists (select 1 from public.organization_members
               where user_id = auth.uid()
                 and organization_id = public.organization_members.organization_id
                 and (role = 'admin' or role = 'owner')));

-- Enable organization members to view members
create policy "Allow organization members to view members"
on public.organization_members for select
using (exists (select 1 from public.organization_members
               where user_id = auth.uid()
                 and organization_id = public.organization_members.organization_id
                 and (role = 'member' or role = 'admin' or role = 'owner')));

-- Enable organization owner and admin to add members
create policy "Allow owners and admins to add members"
on public.organization_members for insert
with check (
  exists (select 1 from public.organization_members
          where user_id = auth.uid()
            and organization_id = public.organization_members.organization_id
            and role in ('owner', 'admin'))
);

-- Enable organization owner and admin to remove members
create policy "Allow owners and admins to remove members"
on public.organization_members for delete
using (exists (select 1 from public.organization_members
               where user_id = auth.uid()
                 and organization_id = public.organization_members.organization_id
                 and role in ('owner', 'admin')));

-- Prevent owners from leaving their own organization
create policy "Prevent owners from leaving their own organization"
    on public.organization_members for delete
    using (
    role != 'owner' -- Owners cannot leave their own organization
    or auth.uid() != user_id  -- Users cannot remove other users
    );


