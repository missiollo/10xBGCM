-- Migration: Initial Schema for Board Game Collection Manager
-- Description: Creates all core tables, relationships, indexes and security policies
-- Author: System
-- Date: 2024-04-27

-- Enable pgcrypto for UUID generation
create extension if not exists pgcrypto;

-- 1. Create base tables without foreign key dependencies
-- Create users table
create table users (
    id uuid primary key default gen_random_uuid(),
    email varchar(254) not null unique,
    username varchar(254) not null unique,
    password_hash text not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);

-- Create games table
create table games (
    id serial primary key,
    tytul varchar(254) not null check (char_length(tytul) >= 1),
    wydawca varchar(254),
    min_graczy integer not null,
    max_graczy integer not null,
    czas_rozgrywki integer,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp,
    constraint chk_graczy check (min_graczy <= max_graczy)
);

-- Create categories table
create table categories (
    id serial primary key,
    nazwa varchar(100) not null unique,
    description text
);

-- Create mechanics table
create table mechanics (
    id serial primary key,
    nazwa varchar(100) not null unique,
    description text
);

-- 2. Create junction tables and tables with foreign key dependencies
-- Create game_categories junction table
create table game_categories (
    game_id integer not null references games(id) on delete cascade,
    category_id integer not null references categories(id) on delete cascade,
    primary key (game_id, category_id)
);

-- Create game_mechanics junction table
create table game_mechanics (
    game_id integer not null references games(id) on delete cascade,
    mechanic_id integer not null references mechanics(id) on delete cascade,
    primary key (game_id, mechanic_id)
);

-- Create collections table
create table collections (
    id serial primary key,
    user_id uuid not null references users(id) on delete cascade,
    game_id integer not null references games(id) on delete cascade,
    added_at timestamptz not null default current_timestamp,
    constraint uq_user_game unique (user_id, game_id)
);

-- Create audit_logs table
create table audit_logs (
    id serial primary key,
    table_name varchar(50) not null,
    operation varchar(10) not null,
    record_id integer not null,
    changed_data jsonb,
    changed_at timestamptz not null default current_timestamp,
    user_id uuid references users(id)
);

-- Create recommendations table
create table recommendations (
    id serial primary key,
    user_id uuid not null references users(id) on delete cascade,
    input_data jsonb not null,
    recommendation varchar(254),
    created_at timestamptz not null default current_timestamp
);

-- 3. Enable RLS on all tables
alter table users enable row level security;
alter table games enable row level security;
alter table categories enable row level security;
alter table mechanics enable row level security;
alter table game_categories enable row level security;
alter table game_mechanics enable row level security;
alter table collections enable row level security;
alter table audit_logs enable row level security;
alter table recommendations enable row level security;

-- 4. Create RLS policies
-- Users policies
create policy "Users can view their own profile" 
    on users for select 
    using (auth.uid() = id);

create policy "Users can update their own profile" 
    on users for update 
    using (auth.uid() = id);

-- Games policies
create policy "Anyone can view games" 
    on games for select 
    to anon, authenticated 
    using (true);

create policy "Authenticated users can create games" 
    on games for insert 
    to authenticated 
    with check (true);

-- Categories policies
create policy "Anyone can view categories" 
    on categories for select 
    to anon, authenticated 
    using (true);

-- Mechanics policies
create policy "Anyone can view mechanics" 
    on mechanics for select 
    to anon, authenticated 
    using (true);

-- Game_categories policies
create policy "Anyone can view game categories" 
    on game_categories for select 
    to anon, authenticated 
    using (true);

create policy "Authenticated users can manage game categories" 
    on game_categories for all 
    to authenticated 
    using (true);

-- Game_mechanics policies
create policy "Anyone can view game mechanics" 
    on game_mechanics for select 
    to anon, authenticated 
    using (true);

create policy "Authenticated users can manage game mechanics" 
    on game_mechanics for all 
    to authenticated 
    using (true);

-- Collections policies
create policy "Users can view their own collections" 
    on collections for select 
    to authenticated 
    using (auth.uid() = user_id);

create policy "Users can manage their own collections" 
    on collections for all 
    to authenticated 
    using (auth.uid() = user_id);

-- Audit_logs policies
create policy "Users can view their own audit logs" 
    on audit_logs for select 
    to authenticated 
    using (auth.uid() = user_id);

-- Recommendations policies
create policy "Users can view their own recommendations" 
    on recommendations for select 
    to authenticated 
    using (auth.uid() = user_id);

create policy "Users can manage their own recommendations" 
    on recommendations for all 
    to authenticated 
    using (auth.uid() = user_id);

-- 5. Create indexes (after all tables and constraints are in place)
create index idx_games_tytul on games(tytul);
create index idx_games_min_graczy on games(min_graczy);
create index idx_games_max_graczy on games(max_graczy);
create index idx_game_categories_game_id on game_categories(game_id);
create index idx_game_categories_category_id on game_categories(category_id);
create index idx_game_mechanics_game_id on game_mechanics(game_id);
create index idx_game_mechanics_mechanic_id on game_mechanics(mechanic_id);
create index idx_collections_user_id on collections(user_id);
create index idx_collections_game_id on collections(game_id);
create index idx_audit_logs_user_id on audit_logs(user_id);
create index idx_recommendations_user_id on recommendations(user_id); 