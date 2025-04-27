# API Endpoint Implementation Plan: Games Resource

## 1. Overview of the Endpoint
This set of endpoints enables full management of the "games" resource (List Games, Game Details, Create, Update, Delete). The goal is to allow users to browse, add, modify, and delete items in the games collection.

## 2. Request Details

### 2.1 GET /api/games
- HTTP Method: GET
- URL: `/api/games`
- Query Parameters:
  - Required: none
  - Optional:
    - `page` (integer, default 1)
    - `limit` (integer, default 20)
    - `title` (string, fuzzy match)
    - `minPlayers` (integer)
    - `maxPlayers` (integer)
    - `categories` (string, comma-separated list of IDs)
    - `mechanics` (string, comma-separated list of IDs)
    - `sortBy` ("title" | "createdAt")
    - `order` ("asc" | "desc", default "asc")
- Body: none

### 2.2 GET /api/games/{gameId}
- HTTP Method: GET
- URL: `/api/games/{gameId}`
- Path Parameters:
  - `gameId` (integer) - Game ID
- Body: none

### 2.3 POST /api/games
- HTTP Method: POST
- URL: `/api/games`
- Headers:
  - `Authorization: Bearer <token>`
- Body (JSON) - type: `CreateGameCommand`:
  ```json
  {
    "title": "string",
    "publisher": "string",          // optional
    "minPlayers": 1,
    "maxPlayers": 4,
    "playTime": 60,                  // optional
    "categoryIds": [1,2],
    "mechanicIds": [1,3]
  }
  ```

### 2.4 PUT /api/games/{gameId}
- HTTP Method: PUT
- URL: `/api/games/{gameId}`
- Headers:
  - `Authorization: Bearer <token>`
- Path Parameters: `gameId` (integer)
- Body: same shape as POST (type: `UpdateGameCommand`)

### 2.5 DELETE /api/games/{gameId}
- HTTP Method: DELETE
- URL: `/api/games/{gameId}`
- Headers:
  - `Authorization: Bearer <token>`
- Path Parameters: `gameId` (integer)
- Body: none

## 3. Response Details

| Endpoint                    | Code   | Response Structure                                    |
|-----------------------------|-------|---------------------------------------------------------|
| GET /api/games              | 200   | `GamesListResponseDto` `{ data: GameDto[]; pagination}` |
| GET /api/games/{gameId}     | 200   | `GetGameResponseDto` (alias `GameDto`)                 |
| POST /api/games             | 201   | `CreateGameResponseDto` (alias `GameDto`)              |
| PUT /api/games/{gameId}     | 200   | `UpdateGameResponseDto` (alias `GameDto`)              |
| DELETE /api/games/{gameId}  | 204   | no content                                             |

- In case of validation error: 400 Bad Request (with error details in JSON format)
- Unauthorized: 401 Unauthorized
- Resource not found: 404 Not Found
- Server errors: 500 Internal Server Error

## 4. Data Flow
1. **Astro Middleware**: attach `supabase` to `context.locals` and check JWT for protected routes.
2. **API Handler**: receive and validate the request using `zod`.
3. **Service Layer (`gamesService`)**:
   - `getGames(filters): Promise<GamesListResponseDto>` - executes paginated query on `games`, joins `game_categories` and `game_mechanics`, returns DTO.
   - `getGameById(id): Promise<GameDto | null>` - fetches game by ID with categories and mechanics.
   - `createGame(cmd: CreateGameCommand): Promise<GameDto>` - adds record to `games`, then entries in `game_categories` and `game_mechanics`.
   - `updateGame(id, cmd: UpdateGameCommand): Promise<GameDto>` - updates `games`, clears and re-creates relationships in join tables.
   - `deleteGame(id): Promise<void>` - deletes record from `games` (Supabase `delete`).
4. **Return Response**: appropriate status code + DTO.

## 5. Security Considerations
- **Authentication**: required for POST, PUT, DELETE - check `Authorization` header and `context.locals.supabase.auth.getUser()`.
- **Authorization**: at MVP stage, any authenticated user can modify games (later: roles/ACL).
- **Validation**: use `zod` to protect against invalid data and injection attacks.
- **Environment**: use `import.meta.env` to read Supabase keys.

## 6. Error Handling
- **400 Bad Request**: invalid input data (`zod` validation, `minPlayers > maxPlayers`).
- **401 Unauthorized**: missing or invalid token.
- **404 Not Found**: requested `gameId` does not exist.
- **500 Internal Server Error**: unhandled exceptions (log error, optional write to error table or external monitoring tool).

## 7. Performance Considerations
- **Indexes**: ensure `id`, `game_categories.category_id`, `game_mechanics.mechanic_id` have indexes.
- **Pagination**: limit the number of results (`limit` + `offset`).
- **Batching**: combine queries to `game_categories` and `game_mechanics` in a single Supabase call `.select('*, game_categories(*), game_mechanics(*)')`.
- **Caching**: optional caching of list or popular queries (e.g. Redis).

## 8. Deployment Stages
1. Create `zod` schemas in `src/lib/schemas/game.schema.ts`.
2. Create `gamesService` in `src/lib/services/games.service.ts` with CRUD methods.
3. Add endpoint files:
   - `src/pages/api/games/index.ts` (GET, POST)
   - `src/pages/api/games/[gameId].ts` (GET, PUT, DELETE)
4. Import and use middleware for `supabase` and JWT in API.
5. Write test cases for CRUD (unit and integration).
6. Update documentation and `README.md` (OpenAPI/Swagger, query examples).
7. Verify linter compliance and build CI/CD pipeline.
8. Deploy on test environment, perform end-to-end tests, and promote to production.
