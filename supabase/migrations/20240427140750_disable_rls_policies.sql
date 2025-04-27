-- Migration: Disable RLS Policies
-- Description: Drops all existing RLS policies and disables RLS on all tables
-- Author: System
-- Date: 2024-04-27

-- Drop existing policies if they exist
drop policy if exists "Users can view their own profile" on users;
drop policy if exists "Users can update their own profile" on users;
drop policy if exists "Anyone can view games" on games;
drop policy if exists "Authenticated users can create games" on games;
drop policy if exists "Anyone can view categories" on categories;
drop policy if exists "Anyone can view mechanics" on mechanics;
drop policy if exists "Anyone can view game categories" on game_categories;
drop policy if exists "Authenticated users can manage game categories" on game_categories;
drop policy if exists "Anyone can view game mechanics" on game_mechanics;
drop policy if exists "Authenticated users can manage game mechanics" on game_mechanics;
drop policy if exists "Users can view their own collections" on collections;
drop policy if exists "Users can manage their own collections" on collections;
drop policy if exists "Users can view their own audit logs" on audit_logs;
drop policy if exists "Users can view their own recommendations" on recommendations;
drop policy if exists "Users can manage their own recommendations" on recommendations;

-- Disable RLS on all tables
alter table if exists users disable row level security;
alter table if exists games disable row level security;
alter table if exists categories disable row level security;
alter table if exists mechanics disable row level security;
alter table if exists game_categories disable row level security;
alter table if exists game_mechanics disable row level security;
alter table if exists collections disable row level security;
alter table if exists audit_logs disable row level security;
alter table if exists recommendations disable row level security; 