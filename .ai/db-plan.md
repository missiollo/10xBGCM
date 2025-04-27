/* Database Schema for Board Game Collection Manager (PostgreSQL) */

# 1. Lista Tabel

## users
- id: UUID PRIMARY KEY
- email: VARCHAR(254) NOT NULL UNIQUE
- username: VARCHAR(254) NOT NULL UNIQUE
- password_hash: TEXT NOT NULL
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

## games
- id: SERIAL PRIMARY KEY
- tytul: VARCHAR(254) NOT NULL CHECK (char_length(tytul) >= 1)
- wydawca: VARCHAR(254)
- min_graczy: INTEGER NOT NULL
- max_graczy: INTEGER NOT NULL
- czas_rozgrywki: INTEGER  -- opcjonalny, np. czas w minutach
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

-- Check constraint for player range
ALTER TABLE games ADD CONSTRAINT chk_graczy CHECK (min_graczy <= max_graczy);

## categories
- id: SERIAL PRIMARY KEY
- nazwa: VARCHAR(100) NOT NULL UNIQUE
- description: TEXT

## mechanics
- id: SERIAL PRIMARY KEY
- nazwa: VARCHAR(100) NOT NULL UNIQUE
- description: TEXT

## game_categories
-- Łączy tabele games i categories (relacja many-to-many)
- game_id: INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE
- category_id: INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE
PRIMARY KEY (game_id, category_id)

## game_mechanics
-- Łączy tabele games i mechanics (relacja many-to-many)
- game_id: INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE
- mechanic_id: INTEGER NOT NULL REFERENCES mechanics(id) ON DELETE CASCADE
PRIMARY KEY (game_id, mechanic_id)

## collections
-- Reprezentuje zbiór gier użytkownika (relacja many-to-many między users a games)
- id: SERIAL PRIMARY KEY
- user_id: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- game_id: INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE
- added_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

-- Unikalność pary user_id i game_id
ALTER TABLE collections ADD CONSTRAINT uq_user_game UNIQUE (user_id, game_id);

## audit_logs
-- Tabela do rejestrowania operacji na krytycznych tabelach
- id: SERIAL PRIMARY KEY
- table_name: VARCHAR(50) NOT NULL
- operation: VARCHAR(10) NOT NULL  -- np. INSERT, UPDATE, DELETE
- record_id: INTEGER NOT NULL
- changed_data: JSONB  -- zapis zmian jako migawka danych
- changed_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- user_id: UUID REFERENCES users(id)

## recommendations
-- Tabela rekomendacji gier
- id: SERIAL PRIMARY KEY
- user_id: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- input_data: JSONB NOT NULL  -- dane wejściowe dla algorytmu rekomendacji
- recommendation: VARCHAR(254)  -- część rekomendacji lub podsumowanie
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

## game_ratings
-- Tabela ocen gier (US-008)
- id: SERIAL PRIMARY KEY
- user_id: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- game_id: INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE
- rating: SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5)
- comment: TEXT
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

-- Unikalność pary user_id i game_id, aby każdy użytkownik mógł ocenić grę tylko raz
ALTER TABLE game_ratings ADD CONSTRAINT uq_user_game_rating UNIQUE (user_id, game_id);

# 2. Relacje między tabelami
- Relacja many-to-many między games a categories poprzez tabelę game_categories.
- Relacja many-to-many między games a mechanics poprzez tabelę game_mechanics.
- Relacja many-to-many między users a games poprzez tabelę collections (każdy użytkownik posiada swoje gry w kolekcji).
- Tabela recommendations powiązana z users (każda rekomendacja dotyczy konkretnego użytkownika).

# 3. Indeksy
- Indeks na games.tytul dla szybkiego wyszukiwania: CREATE INDEX idx_games_tytul ON games(tytul);
- Indeksy na games.min_graczy i games.max_graczy: CREATE INDEX idx_games_min_graczy ON games(min_graczy); CREATE INDEX idx_games_max_graczy ON games(max_graczy);
- Unikalne indeksy na users.email, users.username, categories.nazwa oraz mechanics.nazwa są definiowane poprzez UNIQUE constraints.
- Dodatkowe indeksy na kluczach obcych w tabelach join (game_categories, game_mechanics, collections) mogą poprawić wydajność.

# 4. Zasady RLS (Row-Level Security)
-- Rekomenduje się włączenie RLS na tabelach: collections, recommendations, game_categories, game_mechanics, aby zapewnić, że użytkownicy mają dostęp tylko do swoich danych.
-- Polityki RLS należy skonfigurować osobno przy wdrożeniu migracji, przykładowo:
-- ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY user_isolation ON collections USING (user_id = auth.uid());

# 5. Dodatkowe uwagi
- Schemat został zaprojektowany zgodnie z zasadami 3NF, z możliwością dalszej normalizacji lub denormalizacji w przyszłości.
- Struktura umożliwia przyszłą rozbudowę, np. wdrożenie wielu kolekcji dla jednego użytkownika.
- Audyt operacji na krytycznych danych zapewnia kontrolę nad zmianami w bazie.
- Indeksy oraz ograniczenia poprawiają wydajność i integralność danych. ű