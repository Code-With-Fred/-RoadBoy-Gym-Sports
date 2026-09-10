-- =============================================================================
-- ROADBOY GYM&SPORTS — schema
--
-- Run order: 0001_schema.sql, then 0002_rls.sql, then (optionally) 0003_seed.sql.
--
-- Shape of the domain:
--   a program has many weeks; a week schedules many workouts;
--   a workout has many exercises (through program_exercises);
--   a user buys many programs and tracks progress on each.
--
-- Money is stored in whole Naira as integers. No floats anywhere near a price.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Profiles — one row per auth user, created automatically by the trigger below.
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  avatar_url  text,
  phone       text,
  -- 'admin' unlocks the console. Grant it deliberately, one person at a time.
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on column public.profiles.role is
  'customer or admin. Admin grants full access to /admin — grant sparingly.';

-- Keep profiles in step with auth.users without any application code.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  -- Claim anything bought before the account existed (paid as a guest).
  insert into public.user_programs (user_id, program_slug, purchased_at, current_week)
  select new.id, pe.program_slug, now(), 1
  from public.pending_entitlements pe
  where lower(pe.email) = lower(new.email)
  on conflict (user_id, program_slug) do nothing;

  delete from public.pending_entitlements where lower(email) = lower(new.email);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Catalogue
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  blurb       text,
  image_url   text,
  image_alt   text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.trainers (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,
  role             text not null,
  specialty        text not null,
  years_experience int not null default 0,
  short_bio        text,
  bio              text[] not null default '{}',
  philosophy       text,
  certifications   text[] not null default '{}',
  program_slugs    text[] not null default '{}',
  image_url        text,
  image_alt        text,
  socials          jsonb not null default '{}'::jsonb,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.programs (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  tagline           text,
  description       text,
  goal              text not null,
  secondary_goals   text[] not null default '{}',
  difficulty        text not null,
  equipment         text not null,
  weeks             int not null check (weeks > 0),
  sessions_per_week int not null check (sessions_per_week > 0),
  total_workouts    int not null default 0,
  price_naira       int not null check (price_naira >= 0),
  compare_at_naira  int check (compare_at_naira is null or compare_at_naira >= 0),
  rating            numeric(2,1) not null default 5.0 check (rating between 0 and 5),
  review_count      int not null default 0,
  image_url         text,
  image_alt         text,
  outcomes          text[] not null default '{}',
  "includes"        text[] not null default '{}',
  coach_slug        text references public.trainers(slug) on delete set null,
  featured          boolean not null default false,
  best_seller       boolean not null default false,
  -- Unpublish rather than delete: deleting breaks access for past buyers.
  published         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists programs_published_idx on public.programs (published, price_naira);

create table if not exists public.program_weeks (
  id           uuid primary key default gen_random_uuid(),
  program_slug text not null references public.programs(slug) on delete cascade,
  week_number  int not null check (week_number > 0),
  title        text not null,
  focus        text,
  description  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (program_slug, week_number)
);

create table if not exists public.exercises (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  muscle_group   text not null,
  equipment      text not null,
  difficulty     text not null,
  instructions   text[] not null default '{}',
  substitutions  text[] not null default '{}',
  video_url      text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.workouts (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,
  summary          text,
  muscle_group     text not null,
  equipment        text not null,
  difficulty       text not null,
  duration_minutes int not null default 45,
  image_url        text,
  image_alt        text,
  program_slug     text references public.programs(slug) on delete cascade,
  day_number       int,
  -- Free sessions make up the public library and are safe to index.
  is_free          boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists workouts_program_idx on public.workouts (program_slug, day_number);
create index if not exists workouts_free_idx on public.workouts (is_free);

-- The join that carries the prescription: this exercise, in this workout,
-- for this many sets and reps.
create table if not exists public.program_exercises (
  id            uuid primary key default gen_random_uuid(),
  workout_slug  text not null references public.workouts(slug) on delete cascade,
  exercise_slug text not null references public.exercises(slug) on delete restrict,
  position      int not null default 1,
  sets          int not null default 3,
  reps          text not null default '10',
  rest_seconds  int not null default 60,
  notes         text,
  created_at    timestamptz not null default now(),
  unique (workout_slug, exercise_slug)
);

create index if not exists program_exercises_workout_idx
  on public.program_exercises (workout_slug, position);

-- -----------------------------------------------------------------------------
-- Memberships (the physical gym)
-- -----------------------------------------------------------------------------
create table if not exists public.memberships (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  price_naira int not null check (price_naira >= 0),
  summary     text,
  features    text[] not null default '{}',
  highlight   boolean not null default false,
  badge       text,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.member_subscriptions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  membership_slug text references public.memberships(slug) on delete set null,
  full_name       text,
  email           text,
  status          text not null default 'active'
                    check (status in ('active', 'frozen', 'cancelled')),
  started_at      timestamptz not null default now(),
  ends_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists member_subscriptions_status_idx on public.member_subscriptions (status);

-- -----------------------------------------------------------------------------
-- Commerce
-- -----------------------------------------------------------------------------
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  reference    text unique not null,
  user_id      uuid references auth.users(id) on delete set null,
  email        text not null,
  status       text not null default 'pending'
                 check (status in ('pending', 'paid', 'failed', 'refunded')),
  amount_naira int not null check (amount_naira >= 0),
  provider     text not null default 'paystack',
  paid_at      timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_idx on public.orders (status, created_at desc);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  program_slug text not null references public.programs(slug) on delete restrict,
  price_naira  int not null check (price_naira >= 0),
  created_at   timestamptz not null default now(),
  unique (order_id, program_slug)
);

-- Payment records. Deliberately holds no card data — only the provider's own
-- reference, which is all that is needed to reconcile or refund.
create table if not exists public.payments (
  id                 uuid primary key default gen_random_uuid(),
  order_reference    text not null references public.orders(reference) on delete cascade,
  provider           text not null default 'paystack',
  provider_reference text,
  status             text not null,
  amount_naira       int not null check (amount_naira >= 0),
  created_at         timestamptz not null default now()
);

comment on table public.payments is
  'Never store PAN, CVV or expiry. The provider holds the instrument; we hold their reference.';

-- Bought before signing up? Parked here and claimed by handle_new_user().
create table if not exists public.pending_entitlements (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  program_slug    text not null references public.programs(slug) on delete cascade,
  order_reference text,
  created_at      timestamptz not null default now(),
  unique (email, program_slug)
);

-- -----------------------------------------------------------------------------
-- Entitlements and progress
-- -----------------------------------------------------------------------------
create table if not exists public.user_programs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  program_slug    text not null references public.programs(slug) on delete cascade,
  purchased_at    timestamptz not null default now(),
  current_week    int not null default 1,
  last_trained_at timestamptz,
  created_at      timestamptz not null default now(),
  unique (user_id, program_slug)
);

create index if not exists user_programs_user_idx on public.user_programs (user_id);

create table if not exists public.workout_progress (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  program_slug           text references public.programs(slug) on delete cascade,
  workout_slug           text not null references public.workouts(slug) on delete cascade,
  completed_exercise_ids text[] not null default '{}',
  -- Null while a session is in progress; set when the member finishes it.
  completed_at           timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (user_id, workout_slug)
);

create index if not exists workout_progress_user_idx
  on public.workout_progress (user_id, program_slug, completed_at);

-- -----------------------------------------------------------------------------
-- Marketing content
-- -----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  role              text,
  quote             text not null,
  rating            int not null default 5 check (rating between 1 and 5),
  training_duration text,
  image_url         text,
  published         boolean not null default true,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.transformations (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  age            int,
  starting_point text,
  goal           text,
  program_slug   text references public.programs(slug) on delete set null,
  program_name   text,
  duration       text,
  result         text,
  quote          text,
  before_url     text,
  after_url      text,
  featured       boolean not null default true,
  published      boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.gym_gallery (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  alt_text   text not null,
  published  boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  interest   text,
  coach_slug text,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- updated_at maintenance
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  target text;
begin
  foreach target in array array[
    'profiles', 'categories', 'trainers', 'programs', 'program_weeks', 'exercises',
    'workouts', 'memberships', 'member_subscriptions', 'orders', 'user_programs',
    'workout_progress', 'testimonials', 'transformations', 'gym_gallery'
  ]
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$I;', target);
    execute format(
      'create trigger touch_%1$s before update on public.%1$I
       for each row execute function public.touch_updated_at();', target);
  end loop;
end;
$$;
