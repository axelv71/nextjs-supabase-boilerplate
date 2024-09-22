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
  username text unique,
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
    on public.profiles for update to authenticated
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

-- Function to check if the user is an owner
CREATE FUNCTION is_organization_owner(org_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = auth.uid()
      AND organization_id = org_id
      AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if the user is an admin or owner
CREATE FUNCTION is_organization_admin_or_owner(org_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = auth.uid()
      AND organization_id = org_id
      AND role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if the user is a member
CREATE FUNCTION is_organization_member(org_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = auth.uid()
      AND organization_id = org_id
      AND role IN ('member', 'admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to count the number of owners in an organization
CREATE FUNCTION owner_count(org_id UUID) RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(1) FROM public.organization_members
    WHERE organization_id = org_id
      AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Allow organization owner to manage members
CREATE POLICY "Allow organization owner to manage members"
ON public.organization_members FOR ALL
TO authenticated
USING (is_organization_owner(organization_id));

-- Allow organization admin to manage members
CREATE POLICY "Allow organization admin to manage members"
ON public.organization_members FOR ALL
TO authenticated
USING (is_organization_admin_or_owner(organization_id));

-- Allow organization members to view members
CREATE POLICY "Allow organization members to view members"
ON public.organization_members FOR SELECT
TO authenticated
USING (is_organization_member(organization_id));

-- Allow owners and admins to add members
CREATE POLICY "Allow owners and admins to add members"
ON public.organization_members FOR INSERT
TO authenticated
WITH CHECK (is_organization_admin_or_owner(organization_id));

-- Prevent owners from leaving their own organization
CREATE POLICY "Prevent owners from leaving their own organization"
ON public.organization_members FOR DELETE
TO authenticated
USING (
  role != 'owner'
  OR auth.uid() != user_id
  OR owner_count(organization_id) > 1
);

-- Enable organization members to view their organization
CREATE POLICY "Allow organization members to view their organization"
ON public.organizations FOR SELECT
TO authenticated
USING (is_organization_member(id));

-- Enable organization admins and owners to update their organization
CREATE POLICY "Allow organization admins and owners to update their organization"
ON public.organizations FOR UPDATE
TO authenticated
USING (is_organization_admin_or_owner(id));

-- Allow organization owners to delete their organization
CREATE POLICY "Allow organization owners to delete their organization"
ON public.organizations FOR DELETE
TO authenticated
USING (is_organization_owner(id));

-- Allow authenticated users to create organizations
CREATE POLICY "Allow authenticated users to create organizations"
ON public.organizations FOR INSERT
TO authenticated
WITH CHECK (true);

--
-- Stripe customers
--

-- Create a table to store Stripe customers
create table public.customers (
    id uuid not null references auth.users(id) on delete cascade,
    stripe_customer_id text not null unique,

    primary key (id, stripe_customer_id)
);

alter table public.customers enable row level security;

-- Create a unique index on stripe_customers to prevent duplicate entries
create unique index idx_stripe_customer_user_id on public.customers(id);

-- Enable user to read their own Stripe customer
create policy "Allow user to read their own Stripe customer"
  on public.customers for select to authenticated
  using (auth.uid() = id);

-- Enable user to update their own Stripe customer
create policy "Allow user to update their own Stripe customer"
  on public.customers for update to authenticated
  using (auth.uid() = id);


--
-- Stripe products
--

-- Create a table to store Stripe products
create table public.products (
    id varchar(255) not null unique,
    active boolean not null default true,
    name varchar(255) not null,
    description text,
    image_url text,
    metadata jsonb,

    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),

    primary key (id)
);

alter table public.products enable row level security;

-- Automatically set the updated_at column to the current time when the row is updated
create trigger update_products_updated_at
before update on public.products
for each row
execute procedure update_timestamp();

-- Enable user to read products
create policy "Enable read access for all users"
on "public"."products"
as PERMISSIVE
for SELECT
to public
using (
  true
);

--
-- Stripe prices
--

-- Create enum for price types
create type public.price_type as enum (
    'recurring',
    'one_time'
);

-- Create enum for plan intervals
create type public.plan_interval as enum (
    'day',
    'week',
    'month',
    'year'
);

-- Create a table to store Stripe prices
create table public.prices (
    id varchar(255) not null unique,
    active boolean not null default true,
    description text,
    unit_amount int not null,
    currency varchar(10) not null,
    type public.price_type not null,
    interval public.plan_interval,
    interval_count int,
    trial_period_days int,
    metadata jsonb,

    product_id varchar(255) not null references public.products(id),

    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),

    primary key (id)
);

alter table public.prices enable row level security;

-- Automatically set the updated_at column to the current time when the row is updated
create trigger update_prices_updated_at
before update on public.prices
for each row
execute procedure update_timestamp();

-- Enable user to read prices
create policy "Enable read access for all users"
on "public"."prices"
as PERMISSIVE
for SELECT
to public
using (
  true
);

--
-- Stripe subscriptions
--

-- Create enum for subscription statuses
create type public.subscription_status as enum (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'paused',
    'unpaid'
);

-- Create a table to store Stripe subscriptions
create table public.subscriptions (
    id varchar(255) not null unique,
    status public.subscription_status not null,
    metadata jsonb,
    quantity int,
    cancel_at_period_end boolean not null default false,
    canceled_at timestamp with time zone,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    ended_at timestamp with time zone,
    trial_start timestamp with time zone,
    trial_end timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),

    user_id uuid not null references public.customers(id),
    organization_id uuid not null references public.organizations(id),
    price_id varchar(255) not null references public.prices(id),

    primary key (id)
);

alter table public.subscriptions enable row level security;

-- Automatically set the updated_at column to the current time when the row is updated
create trigger update_subscriptions_updated_at
before update on public.subscriptions
for each row
execute procedure update_timestamp();

-- Enable user to read their own subscriptions
create policy "Allow user to read their own subscriptions"
  on public.subscriptions for select to authenticated
  using (auth.uid() = user_id);

-- Enable organization members to view subscriptions of their organization
create policy "Allow organization members to view subscriptions"
  on public.subscriptions
  for select to authenticated
  using (
    exists (
      select 1
      from public.organization_members
      where organization_members.organization_id = public.subscriptions.organization_id
      and organization_members.user_id = auth.uid()
    )
  );
