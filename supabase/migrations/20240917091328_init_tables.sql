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

-- Inserts a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, picture_url, email)
  values (new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'picture', new.email);
  return new;
end;
$$;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
