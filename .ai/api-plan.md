# REST API Plan

## 1. Resources

- **Games** – backed by the `games` table
- **Categories** – backed by the `categories` table
- **Mechanics** – backed by the `mechanics` table
- **Collections** – backed by the `collections` table (many-to-many user↔game)
- **Recommendations** – backed by the `recommendations` table
- **Ratings** – assumed extension via `game_ratings` table
- **Audit Logs** – backed by the `audit_logs` table (internal)

## 2. Endpoints



### 2.2 Users

#### GET /api/users/me
- Description: Retrieve profile of the authenticated user.
- Headers: Authorization: Bearer <token>
- Response 200 OK:
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "string",
  "createdAt": "2024-01-01T12:00:00Z"
}
```
- Errors: 401 Unauthorized

### 2.3 Games

#### GET /api/games
- Description: List games with pagination, filtering, and sorting.
- Query Parameters:
  - page (integer, default=1)
  - limit (integer, default=20)
  - title (string, fuzzy match)
  - minPlayers (integer)
  - maxPlayers (integer)
  - categories (comma-separated IDs)
  - mechanics (comma-separated IDs)
  - sortBy (string: "title" | "createdAt")
  - order (string: "asc" | "desc", default="asc")
- Response 200 OK:
```json
{
  "data": [ /* array of games */ ],
  "pagination": { "page": 1, "limit": 20, "total": 100 }
}
```

#### GET /api/games/{gameId}
- Description: Get details for a single game.
- Path Parameters: gameId (integer)
- Response 200 OK: game object including categories and mechanics arrays.
- Errors: 404 Not Found

#### POST /api/games
- Description: Create a new game entry.
- Headers: Authorization: Bearer <token>
- Request Body (JSON):
```json
{
  "title": "string",
  "publisher": "string",
  "minPlayers": 1,
  "maxPlayers": 4,
  "playTime": 60,
  "categoryIds": [1,2],
  "mechanicIds": [1,3]
}
```
- Response 201 Created: newly created game object
- Errors:
  - 400 Bad Request – validation errors (title missing, minPlayers > maxPlayers, etc.)

#### PUT /api/games/{gameId}
- Description: Update an existing game.
- Headers: Authorization: Bearer <token>
- Request Body: same as POST /api/games
- Response 200 OK: updated game object
- Errors: 400 Bad Request, 401 Unauthorized, 404 Not Found

#### DELETE /api/games/{gameId}
- Description: Delete a game globally.
- Headers: Authorization: Bearer <token>
- Response 204 No Content
- Errors: 404 Not Found, 401 Unauthorized

### 2.4 Categories

#### GET /api/categories
- Description: Retrieve all game categories.
- Response 200 OK: array of categories

#### POST /api/categories
- Description: Create a new category (admin only).
- Request Body:
```json
{ "name": "string", "description": "string" }
```
- Response 201 Created: new category
- Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 409 Conflict

### 2.5 Mechanics

#### GET /api/mechanics
- Description: Retrieve all game mechanics.
- Response 200 OK: array of mechanics

#### POST /api/mechanics
- Description: Create a new mechanic (admin only).
- Request Body:
```json
{ "name": "string", "description": "string" }
```
- Response 201 Created: new mechanic
- Errors: similar to categories

### 2.6 Collections

#### GET /api/collections
- Description: List current user’s collection with pagination.
- Headers: Authorization: Bearer <token>
- Query: page, limit
- Response 200 OK:
```json
{
  "data": [ /* array of { collectionId, game } */ ],
  "pagination": { ... }
}
```

#### POST /api/collections
- Description: Add a game to the user’s collection.
- Headers: Authorization: Bearer <token>
- Body:
```json
{ "gameId": 123 }
```
- Response 201 Created: { "collectionId": 456, "addedAt": "..." }
- Errors:
  - 400 Bad Request – missing gameId
  - 409 Conflict – already in collection

#### DELETE /api/collections/{collectionId}
- Description: Remove a game from the user’s collection.
- Headers: Authorization: Bearer <token>
- Response 204 No Content
- Errors: 404 Not Found, 401 Unauthorized

### 2.7 Recommendations

#### GET /api/recommendations
- Description: Fetch past recommendations for the user.
- Headers: Authorization: Bearer <token>
- Query: page, limit
- Response 200 OK: paginated list of recommendations

#### POST /api/recommendations
- Description: Generate a new set of recommendations via AI.
- Headers: Authorization: Bearer <token>
- Body: none
- Response 201 Created:
```json
{
  "recommendations": [ "Game A", "Game B", "Game C", "Game D", "Game E" ]
}
```
- Errors:
  - 400 Bad Request – fewer than 10 games in collection (PRD US-007)

### 2.8 Ratings

#### GET /api/games/{gameId}/ratings
- Description: List all ratings for a game.
- Query: page, limit
- Response 200 OK: array of { ratingId, userId, rating, comment, createdAt }

#### POST /api/games/{gameId}/ratings
- Description: Rate a game.
- Headers: Authorization: Bearer <token>
- Body:
```json
{ "rating": 4, "comment": "Great for families!" }
```
- Response 201 Created: new rating object
- Errors:
  - 400 Bad Request – rating out of range (1–5)
  - 409 Conflict – user already rated this game

#### PUT /api/games/{gameId}/ratings/{ratingId}
- Description: Update an existing rating.
- Body: same as POST
- Response 200 OK: updated rating

#### DELETE /api/games/{gameId}/ratings/{ratingId}
- Description: Remove a rating.
- Response 204 No Content

## 3. Authentication and Authorization

- All endpoints under `/api/*` require a valid Supabase JWT except `/api/auth/*`.
- Middleware enforces token validation and populates `currentUser` context.
- Row-Level Security (RLS) policies on:
  - `collections`, `recommendations`, `game_categories`, `game_mechanics` to restrict access by `user_id`.
- Admin-only guards on category and mechanic creation endpoints.
- Rate limiting: e.g., 100 requests per minute per user/IP via middleware.

## 4. Validation and Business Logic

- **Games**:
  - `title`: non-empty, max 254 chars.
  - `minPlayers` ≤ `maxPlayers`.
  - `playTime`: ≥ 0 (minutes).
  - Ensure `categoryIds` and `mechanicIds` exist, else 400.
- **Users**:
  - `password`: minimum length (e.g., 8 chars).
  - `email`: valid format.
- **Collections**:
  - Unique `(user_id, game_id)` constraint; return 409 on duplicate.
- **Recommendations**:
  - Only allow POST if user has ≥10 games; else respond 400 with message.
  - Persist `input_data` JSON and summary in `recommendations` table.
- **Ratings**:
  - `rating`: integer 1–5 inclusive.
  - One rating per user per game; enforced via unique constraint.
- **Audit Logs**:
  - On INSERT/UPDATE/DELETE of critical tables (`games`, `collections`, `recommendations`), write to `audit_logs`.
- **Pagination & Sorting**:
  - Apply on GET list endpoints; default `page=1`, `limit=20`.
- **Error Handling**:
  - Guard clauses at start of controller functions.
  - Return consistent error format:
    ```json
    { "error": { "code": "BadRequest", "message": "..." } }
    ```
