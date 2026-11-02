-- supabase/setup.sql
--
-- Creates everything the app needs in a brand-new Supabase project.
-- Run it once in the Supabase SQL Editor. It is safe to run again.
--
-- The tables were worked out from how services/auth.ts uses them, because the
-- original schema was never saved in this project. Do NOT also run
-- migrations/20260830_secure_pin_auth.sql: it updates that older schema.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  account_number text unique,
  phone_number text unique,
  first_name text,
  last_name text,
  date_of_birth date,
  bvn text,
  nin text,
  state text,
  lga text,
  city text,
  street_address text,
  identity_verified boolean not null default false,
  balance numeric(14, 2) not null default 50000, -- Test money for new accounts
  tier integer not null default 1,
  transfer_limit numeric(14, 2) not null default 50000,
  employment_status text,
  monthly_income numeric(14, 2),
  employer_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  masked_number text not null,
  expiry_date text not null,
  is_frozen boolean not null default false,
  monthly_limit numeric(14, 2) not null default 500000,
  monthly_spent numeric(14, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users (id) on delete cascade,
  receiver_account_number text not null,
  amount numeric(14, 2) not null check (amount > 0),
  narration text,
  created_at timestamptz not null default now()
);

create table if not exists public.transaction_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  transaction_id uuid not null references public.transactions (id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

-- PIN hashes get their own table with no access rules, so the app can never
-- read them. The app loads whole profile rows, so a column there would be exposed.
create table if not exists public.user_pins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  pin_hash text not null
);

-- ---------------------------------------------------------------------------
-- 2. Access rules: each person can only reach their own rows
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.cards enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_reports enable row level security;
alter table public.user_pins enable row level security;

revoke all on public.profiles, public.cards, public.transactions,
  public.transaction_reports, public.user_pins from anon, authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.cards to authenticated;
grant select, insert on public.transactions to authenticated;
grant select, insert on public.transaction_reports to authenticated;

drop policy if exists "own profile: read" on public.profiles;
create policy "own profile: read" on public.profiles
  for select to authenticated using (auth.uid() = id);
drop policy if exists "own profile: create" on public.profiles;
create policy "own profile: create" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
drop policy if exists "own profile: update" on public.profiles;
create policy "own profile: update" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own card: read" on public.cards;
create policy "own card: read" on public.cards
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "own card: create" on public.cards;
create policy "own card: create" on public.cards
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "own card: update" on public.cards;
create policy "own card: update" on public.cards
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own transactions: read" on public.transactions;
create policy "own transactions: read" on public.transactions
  for select to authenticated using (auth.uid() = sender_id);
drop policy if exists "own transactions: create" on public.transactions;
create policy "own transactions: create" on public.transactions
  for insert to authenticated with check (auth.uid() = sender_id);

drop policy if exists "own reports: read" on public.transaction_reports;
create policy "own reports: read" on public.transaction_reports
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "own reports: create" on public.transaction_reports;
create policy "own reports: create" on public.transaction_reports
  for insert to authenticated with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. PIN functions: a person can only set or check their own PIN
-- ---------------------------------------------------------------------------

create or replace function public.set_pin(p_user_id uuid, p_pin text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'Not allowed';
  end if;

  insert into user_pins (user_id, pin_hash)
  values (p_user_id, crypt(p_pin, gen_salt('bf')))
  on conflict (user_id) do update set pin_hash = excluded.pin_hash;
end;
$$;

create or replace function public.verify_pin_by_id(p_user_id uuid, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  stored text;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    return false;
  end if;

  select pin_hash into stored from user_pins where user_id = p_user_id;

  if stored is null then
    return false;
  end if;

  return stored = crypt(p_pin, stored);
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Transfers: all of it succeeds or none of it does
-- ---------------------------------------------------------------------------

create or replace function public.transfer_money(
  p_recipient_account text,
  p_amount numeric,
  p_narration text
)
returns table (status text, message text)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_sender uuid := auth.uid();
  v_recipient uuid;
  v_balance numeric;
begin
  if v_sender is null then
    return query select 'failed'::text, 'Please sign in again'::text;
    return;
  end if;

  if p_amount is null or p_amount <= 0 then
    return query select 'failed'::text, 'Enter a valid amount'::text;
    return;
  end if;

  select p.id into v_recipient from profiles p where p.account_number = p_recipient_account;

  if v_recipient is null then
    return query select 'failed'::text, 'Receiver account not found'::text;
    return;
  end if;

  if v_recipient = v_sender then
    return query select 'failed'::text, 'You cannot send money to yourself'::text;
    return;
  end if;

  -- Lock both rows in a fixed order so two transfers can't block each other.
  perform 1 from profiles p where p.id in (v_sender, v_recipient) order by p.id for update;

  select p.balance into v_balance from profiles p where p.id = v_sender;

  if v_balance is null or v_balance < p_amount then
    return query select 'failed'::text, 'Insufficient balance'::text;
    return;
  end if;

  update profiles p set balance = p.balance - p_amount where p.id = v_sender;
  update profiles p set balance = p.balance + p_amount where p.id = v_recipient;

  insert into transactions (sender_id, receiver_account_number, amount, narration)
  values (v_sender, p_recipient_account, p_amount, p_narration);

  return query select 'success'::text, 'Transfer successful'::text;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Lookups that need to see past "own rows only", without exposing the rows
-- ---------------------------------------------------------------------------

-- Answers only yes or no. Works before login, for the phone number screen.
create or replace function public.phone_exists(p_phone text)
returns boolean
language sql
security definer
set search_path = public, extensions
as $$
  select exists (select 1 from profiles where phone_number = p_phone);
$$;

-- Returns only a name, for confirming who a transfer is going to.
create or replace function public.lookup_account_name(p_account text)
returns text
language sql
security definer
set search_path = public, extensions
as $$
  select trim(coalesce(first_name, '') || ' ' || coalesce(last_name, ''))
  from profiles
  where account_number = p_account;
$$;

-- ---------------------------------------------------------------------------
-- 6. Who may call the functions
-- ---------------------------------------------------------------------------

revoke all on function public.set_pin(uuid, text) from public, anon;
revoke all on function public.verify_pin_by_id(uuid, text) from public, anon;
revoke all on function public.transfer_money(text, numeric, text) from public, anon;
revoke all on function public.phone_exists(text) from public;
revoke all on function public.lookup_account_name(text) from public, anon;

grant execute on function public.set_pin(uuid, text) to authenticated;
grant execute on function public.verify_pin_by_id(uuid, text) to authenticated;
grant execute on function public.transfer_money(text, numeric, text) to authenticated;
grant execute on function public.phone_exists(text) to anon, authenticated;
grant execute on function public.lookup_account_name(text) to authenticated;
