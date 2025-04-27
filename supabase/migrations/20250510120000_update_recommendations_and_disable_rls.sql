-- migration: update recommendation column and disable row level security for all tables
-- timestamp: 2025-05-10 12:00:00+00

alter table recommendations alter column recommendation type varchar(10000);

-- disable row level security on all tables
alter table users disable row level security;
alter table games disable row level security;
alter table categories disable row level security;
alter table mechanics disable row level security;
alter table game_categories disable row level security;
alter table game_mechanics disable row level security;
alter table collections disable row level security;
alter table recommendations disable row level security;
alter table game_ratings disable row level security;
alter table audit_logs disable row level security; 