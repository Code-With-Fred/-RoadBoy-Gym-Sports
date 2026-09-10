-- =============================================================================
-- ROADBOY GYM&SPORTS — Row Level Security
--
-- The rule the whole application rests on: a member can read the workouts of a
-- program they have paid for, and nothing else belonging to anyone else.
--
-- Shape of the policies:
--   * Marketing content  -> readable by anyone (including logged-out visitors),
--                           writable only by admins.
--   * Paid content       -> readable only with a matching user_programs row.
--   * Personal rows      -> readable and writable only by their owner.
--   * Money              -> readable by the owner and admins; written only by
--                           the service role (the payment webhook).
-- =============================================================================

alter table public.profiles              enable row level security;
alter table public.categories            enable row level security;
alter table public.trainers              enable row level security;
alter table public.programs              enable row level security;
alter table public.program_weeks         enable row level security;
alter table public.exercises             enable row level security;
alter table public.workouts              enable row level security;
alter table public.program_exercises     enable row level security;
alter table public.memberships           enable row level security;
alter table public.member_subscriptions  enable row level security;
alter table public.orders                enable row level security;
alter table public.order_items           enable row level security;
alter table public.payments              enable row level security;
alter table public.pending_entitlements  enable row level security;
alter table public.user_programs         enable row level security;
alter table public.workout_progress      enable row level security;
alter table public.testimonials          enable row level security;
alter table public.transformations       enable row level security;
alter table public.gym_gallery           enable row level security;
alter table public.contact_messages      enable row level security;

-- -----------------------------------------------------------------------------
-- Helpers
--
-- SECURITY DEFINER so the function can read profiles.role without the calling
-- user needing a policy that would itself recurse into this check.
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.owns_program(target_slug text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_programs
    where user_id = auth.uid() and program_slug = target_slug
  );
$$;

-- -----------------------------------------------------------------------------
-- Profiles
-- -----------------------------------------------------------------------------
drop policy if exists "profiles readable by owner or admin" on public.profiles;
create policy "profiles readable by owner or admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles updatable by owner" on public.profiles;
create policy "profiles updatable by owner"
  on public.profiles for update
  using (id = auth.uid())
  -- Without this, a member could promote themselves by writing role='admin'.
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists "profiles manageable by admin" on public.profiles;
create policy "profiles manageable by admin"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Public marketing content: read for everyone, write for admins
-- -----------------------------------------------------------------------------
do $$
declare
  target text;
begin
  foreach target in array array[
    'categories', 'trainers', 'program_weeks', 'exercises', 'program_exercises', 'memberships'
  ]
  loop
    execute format('drop policy if exists "%1$s public read" on public.%1$I;', target);
    execute format(
      'create policy "%1$s public read" on public.%1$I for select using (true);', target);

    execute format('drop policy if exists "%1$s admin write" on public.%1$I;', target);
    execute format(
      'create policy "%1$s admin write" on public.%1$I for all
       using (public.is_admin()) with check (public.is_admin());', target);
  end loop;
end;
$$;

-- Published-only variants, so an unpublished draft never leaks.
drop policy if exists "programs public read" on public.programs;
create policy "programs public read"
  on public.programs for select
  using (published or public.is_admin());

drop policy if exists "programs admin write" on public.programs;
create policy "programs admin write"
  on public.programs for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "testimonials public read" on public.testimonials;
create policy "testimonials public read"
  on public.testimonials for select
  using (published or public.is_admin());

drop policy if exists "testimonials admin write" on public.testimonials;
create policy "testimonials admin write"
  on public.testimonials for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "transformations public read" on public.transformations;
create policy "transformations public read"
  on public.transformations for select
  using (published or public.is_admin());

drop policy if exists "transformations admin write" on public.transformations;
create policy "transformations admin write"
  on public.transformations for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "gallery public read" on public.gym_gallery;
create policy "gallery public read"
  on public.gym_gallery for select
  using (published or public.is_admin());

drop policy if exists "gallery admin write" on public.gym_gallery;
create policy "gallery admin write"
  on public.gym_gallery for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Workouts — the paywall
--
-- Free sessions are public. Everything else requires a purchase. This is the
-- policy that actually protects the product; the UI lock is only a courtesy.
-- -----------------------------------------------------------------------------
drop policy if exists "workouts readable when free or owned" on public.workouts;
create policy "workouts readable when free or owned"
  on public.workouts for select
  using (
    is_free
    or program_slug is null
    or public.owns_program(program_slug)
    or public.is_admin()
  );

drop policy if exists "workouts admin write" on public.workouts;
create policy "workouts admin write"
  on public.workouts for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Entitlements
--
-- No insert or update policy: a member must never be able to grant themselves a
-- program. Only the service role (the payment webhook) writes here, and the
-- service role bypasses RLS entirely.
-- -----------------------------------------------------------------------------
drop policy if exists "user_programs readable by owner" on public.user_programs;
create policy "user_programs readable by owner"
  on public.user_programs for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "user_programs admin write" on public.user_programs;
create policy "user_programs admin write"
  on public.user_programs for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Progress — owned entirely by the member, but only for programs they hold
-- -----------------------------------------------------------------------------
drop policy if exists "progress readable by owner" on public.workout_progress;
create policy "progress readable by owner"
  on public.workout_progress for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "progress insertable by owner" on public.workout_progress;
create policy "progress insertable by owner"
  on public.workout_progress for insert
  with check (
    user_id = auth.uid()
    and (program_slug is null or public.owns_program(program_slug))
  );

drop policy if exists "progress updatable by owner" on public.workout_progress;
create policy "progress updatable by owner"
  on public.workout_progress for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "progress deletable by owner" on public.workout_progress;
create policy "progress deletable by owner"
  on public.workout_progress for delete
  using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Orders and payments — readable by the buyer, written by the webhook
-- -----------------------------------------------------------------------------
drop policy if exists "orders readable by owner" on public.orders;
create policy "orders readable by owner"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());

-- A signed-in customer may record their own pending order at checkout. Marking
-- it paid is not possible here — the check pins the status.
drop policy if exists "orders insertable by buyer" on public.orders;
create policy "orders insertable by buyer"
  on public.orders for insert
  with check (
    status = 'pending'
    and (user_id = auth.uid() or user_id is null)
  );

drop policy if exists "orders admin write" on public.orders;
create policy "orders admin write"
  on public.orders for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "order_items readable by owner" on public.order_items;
create policy "order_items readable by owner"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "order_items admin write" on public.order_items;
create policy "order_items admin write"
  on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());

-- Payments are admin-only reading. Members see their order, not the gateway row.
drop policy if exists "payments admin read" on public.payments;
create policy "payments admin read"
  on public.payments for select
  using (public.is_admin());

-- No policies at all on pending_entitlements: the webhook writes it with the
-- service role and the signup trigger consumes it as SECURITY DEFINER. Nothing
-- reaches it through the anon or authenticated roles.

-- -----------------------------------------------------------------------------
-- Memberships at the gym
-- -----------------------------------------------------------------------------
drop policy if exists "subscriptions readable by owner" on public.member_subscriptions;
create policy "subscriptions readable by owner"
  on public.member_subscriptions for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "subscriptions admin write" on public.member_subscriptions;
create policy "subscriptions admin write"
  on public.member_subscriptions for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Contact form — anyone may write one, only admins may read them
-- -----------------------------------------------------------------------------
drop policy if exists "contact insert by anyone" on public.contact_messages;
create policy "contact insert by anyone"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "contact admin read" on public.contact_messages;
create policy "contact admin read"
  on public.contact_messages for select
  using (public.is_admin());

drop policy if exists "contact admin write" on public.contact_messages;
create policy "contact admin write"
  on public.contact_messages for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Promote your own account to admin after signing up:
--
--   update public.profiles set role = 'admin' where email = 'you@yourgym.com';
-- -----------------------------------------------------------------------------
