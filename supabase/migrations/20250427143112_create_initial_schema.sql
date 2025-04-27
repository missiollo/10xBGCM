-- migration: initial schema for board game collection manager
-- timestamp: 2025-04-27 14:31:12+00
-- this migration creates all core tables, indexes, constraints, and configures row level security with granular policies per supabase best practices

-- 1. users table: stores application user accounts
create table if not exists users (
  id uuid primary key,
  email varchar(254) not null unique,
  username varchar(254) not null unique,
  password_hash text not null,
  created_at timestamp with time zone not null default current_timestamp,
  updated_at timestamp with time zone not null default current_timestamp
);

-- enable row level security on users
alter table users enable row level security;

-- policy: allow authenticated users to select only their own user row
create policy auth_select_users on users for select to authenticated using (id = auth.uid());

-- policy: allow anonymous users to insert new users (registration)
create policy anon_insert_users on users for insert to anon with check (true);

-- policy: allow authenticated users to update only their own user row
create policy auth_update_users on users for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- policy: allow authenticated users to delete only their own user row
create policy auth_delete_users on users for delete to authenticated using (id = auth.uid());

-- 2. games table: stores board game metadata
create table if not exists games (
  id serial primary key,
  tytul varchar(254) not null check (char_length(tytul) >= 1),
  wydawca varchar(254),
  min_graczy integer not null,
  max_graczy integer not null,
  czas_rozgrywki integer,
  created_at timestamp with time zone not null default current_timestamp,
  updated_at timestamp with time zone not null default current_timestamp,
  constraint chk_graczy check (min_graczy <= max_graczy)
);

-- indexes on games for performance
create index if not exists idx_games_tytul on games (tytul);
create index if not exists idx_games_min_graczy on games (min_graczy);
create index if not exists idx_games_max_graczy on games (max_graczy);

-- enable row level security on games
alter table games enable row level security;

-- policy: allow authenticated users to select games
create policy auth_select_games on games for select to authenticated using (true);

-- policy: allow authenticated users to insert games
create policy auth_insert_games on games for insert to authenticated with check (true);

-- policy: allow authenticated users to update games
create policy auth_update_games on games for update to authenticated using (true) with check (true);

-- policy: allow authenticated users to delete games
create policy auth_delete_games on games for delete to authenticated using (true);

-- 3. categories table: static list of game categories
create table if not exists categories (
  id serial primary key,
  nazwa varchar(100) not null unique,
  description text
);

-- enable row level security on categories
alter table categories enable row level security;

-- policy: allow all users (anon + authenticated) to select categories
create policy anon_select_categories on categories for select to anon using (true);
create policy auth_select_categories on categories for select to authenticated using (true);

-- policy: allow authenticated users to manage categories
create policy auth_insert_categories on categories for insert to authenticated with check (true);
create policy auth_update_categories on categories for update to authenticated using (true) with check (true);
create policy auth_delete_categories on categories for delete to authenticated using (true);

-- 4. mechanics table: static list of game mechanics
create table if not exists mechanics (
  id serial primary key,
  nazwa varchar(100) not null unique,
  description text
);

-- enable row level security on mechanics
alter table mechanics enable row level security;

-- policy: allow all users (anon + authenticated) to select mechanics
create policy anon_select_mechanics on mechanics for select to anon using (true);
create policy auth_select_mechanics on mechanics for select to authenticated using (true);

-- policy: allow authenticated users to manage mechanics
create policy auth_insert_mechanics on mechanics for insert to authenticated with check (true);
create policy auth_update_mechanics on mechanics for update to authenticated using (true) with check (true);
create policy auth_delete_mechanics on mechanics for delete to authenticated using (true);

-- 5. game_categories table: many-to-many relation between games and categories
create table if not exists game_categories (
  game_id integer not null references games(id) on delete cascade,
  category_id integer not null references categories(id) on delete cascade,
  primary key (game_id, category_id)
);

-- enable row level security on game_categories
alter table game_categories enable row level security;

-- policy: allow all users to select game_categories
create policy anon_select_game_categories on game_categories for select to anon using (true);
create policy auth_select_game_categories on game_categories for select to authenticated using (true);

-- policy: allow authenticated users to manage game_categories entries
create policy auth_insert_game_categories on game_categories for insert to authenticated with check (true);
create policy auth_delete_game_categories on game_categories for delete to authenticated using (true);

-- 6. game_mechanics table: many-to-many relation between games and mechanics
create table if not exists game_mechanics (
  game_id integer not null references games(id) on delete cascade,
  mechanic_id integer not null references mechanics(id) on delete cascade,
  primary key (game_id, mechanic_id)
);

-- enable row level security on game_mechanics
alter table game_mechanics enable row level security;

-- policy: allow all users to select game_mechanics
create policy anon_select_game_mechanics on game_mechanics for select to anon using (true);
create policy auth_select_game_mechanics on game_mechanics for select to authenticated using (true);

-- policy: allow authenticated users to manage game_mechanics entries
create policy auth_insert_game_mechanics on game_mechanics for insert to authenticated with check (true);
create policy auth_delete_game_mechanics on game_mechanics for delete to authenticated using (true);

-- 7. collections table: mapping users to owned games
create table if not exists collections (
  id serial primary key,
  user_id uuid not null references users(id) on delete cascade,
  game_id integer not null references games(id) on delete cascade,
  added_at timestamp with time zone not null default current_timestamp,
  constraint uq_user_game unique (user_id, game_id)
);

-- enable row level security on collections
alter table collections enable row level security;

-- policy: allow authenticated users to select only their own collections
create policy auth_select_collections on collections for select to authenticated using (user_id = auth.uid());

-- policy: allow authenticated users to insert into their own collections
create policy auth_insert_collections on collections for insert to authenticated with check (user_id = auth.uid());

-- policy: allow authenticated users to delete only their own collection entries
create policy auth_delete_collections on collections for delete to authenticated using (user_id = auth.uid());

-- 8. recommendations table: stores recommendations per user
create table if not exists recommendations (
  id serial primary key,
  user_id uuid not null references users(id) on delete cascade,
  input_data jsonb not null,
  recommendation varchar(254),
  created_at timestamp with time zone not null default current_timestamp
);

-- enable row level security on recommendations
alter table recommendations enable row level security;

-- policy: allow authenticated users to select only their own recommendations
create policy auth_select_recommendations on recommendations for select to authenticated using (user_id = auth.uid());

-- policy: allow authenticated users to insert their own recommendation entries
create policy auth_insert_recommendations on recommendations for insert to authenticated with check (user_id = auth.uid());

-- 9. game_ratings table: user ratings and comments for games
create table if not exists game_ratings (
  id serial primary key,
  user_id uuid not null references users(id) on delete cascade,
  game_id integer not null references games(id) on delete cascade,
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone not null default current_timestamp,
  updated_at timestamp with time zone not null default current_timestamp,
  constraint uq_user_game_rating unique (user_id, game_id)
);

-- enable row level security on game_ratings
alter table game_ratings enable row level security;

-- policy: allow authenticated users to select only their own ratings
create policy auth_select_game_ratings on game_ratings for select to authenticated using (user_id = auth.uid());

-- policy: allow authenticated users to insert their own ratings
create policy auth_insert_game_ratings on game_ratings for insert to authenticated with check (user_id = auth.uid());

-- policy: allow authenticated users to update only their own ratings
create policy auth_update_game_ratings on game_ratings for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- policy: allow authenticated users to delete only their own ratings
create policy auth_delete_game_ratings on game_ratings for delete to authenticated using (user_id = auth.uid());

-- 10. audit_logs table: records operations on critical tables
create table if not exists audit_logs (
  id serial primary key,
  table_name varchar(50) not null,
  operation varchar(10) not null,
  record_id integer not null,
  changed_data jsonb,
  changed_at timestamp with time zone not null default current_timestamp,
  user_id uuid references users(id)
);

-- enable row level security on audit_logs
alter table audit_logs enable row level security;

-- policies: disallow anon and authenticated roles to access audit logs (only service_role can bypass rls)
create policy anon_select_audit_logs on audit_logs for select to anon using (false);
create policy auth_select_audit_logs on audit_logs for select to authenticated using (false);

create policy anon_insert_audit_logs on audit_logs for insert to anon with check (false);
create policy auth_insert_audit_logs on audit_logs for insert to authenticated with check (false);

create policy anon_update_audit_logs on audit_logs for update to anon using (false) with check (false);
create policy auth_update_audit_logs on audit_logs for update to authenticated using (false) with check (false);

create policy anon_delete_audit_logs on audit_logs for delete to anon using (false);
create policy auth_delete_audit_logs on audit_logs for delete to authenticated using (false); 