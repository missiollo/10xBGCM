import type { Tables } from "./db/database.types";

/**
 * Common DTOs for paginated and list responses
 */
export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}
export interface ListResponseDto<T> {
  data: T[];
  pagination: PaginationDto;
}

/**
 * User DTOs
 */
export interface UserDto {
  id: Tables<"users">["id"];
  email: Tables<"users">["email"];
  username: Tables<"users">["username"];
  createdAt: Tables<"users">["created_at"];
}
export type GetCurrentUserResponseDto = UserDto;

/**
 * Category DTOs and Commands
 */
export interface CategoryDto {
  id: Tables<"categories">["id"];
  name: Tables<"categories">["nazwa"];
  description: Tables<"categories">["description"];
}
export type CategoriesResponseDto = CategoryDto[];
export interface CreateCategoryCommand {
  name: Tables<"categories">["nazwa"];
  // optional because DB allows null
  description?: Tables<"categories">["description"];
}
export type CreateCategoryResponseDto = CategoryDto;

/**
 * Mechanic DTOs and Commands
 */
export interface MechanicDto {
  id: Tables<"mechanics">["id"];
  name: Tables<"mechanics">["nazwa"];
  description: Tables<"mechanics">["description"];
}
export type MechanicsResponseDto = MechanicDto[];
export interface CreateMechanicCommand {
  name: Tables<"mechanics">["nazwa"];
  // optional because DB allows null
  description?: Tables<"mechanics">["description"];
}
export type CreateMechanicResponseDto = MechanicDto;

/**
 * Game DTOs and Commands
 */
export interface GameDto {
  id: Tables<"games">["id"];
  title: Tables<"games">["tytul"];
  publisher: Tables<"games">["wydawca"];
  minPlayers: Tables<"games">["min_graczy"];
  maxPlayers: Tables<"games">["max_graczy"];
  playTime: Tables<"games">["czas_rozgrywki"];
  categories: CategoryDto[];
  mechanics: MechanicDto[];
  createdAt: Tables<"games">["created_at"];
  updatedAt: Tables<"games">["updated_at"];
}
export interface CreateGameCommand {
  title: Tables<"games">["tytul"];
  // optional because DB allows null
  publisher?: Tables<"games">["wydawca"];
  minPlayers: Tables<"games">["min_graczy"];
  maxPlayers: Tables<"games">["max_graczy"];
  // optional because DB allows null
  playTime?: Tables<"games">["czas_rozgrywki"];
  categoryIds: Tables<"game_categories">["category_id"][];
  mechanicIds: Tables<"game_mechanics">["mechanic_id"][];
}
export type UpdateGameCommand = CreateGameCommand;
export type GetGameResponseDto = GameDto;
export type CreateGameResponseDto = GameDto;
export type UpdateGameResponseDto = GameDto;
export type GamesListResponseDto = ListResponseDto<GameDto>;

/**
 * Collection DTOs and Commands
 */
export interface CollectionItemDto {
  collectionId: Tables<"collections">["id"];
  game: GameDto;
}
export type CollectionsListResponseDto = ListResponseDto<CollectionItemDto>;
export interface AddToCollectionCommand {
  gameId: Tables<"collections">["game_id"];
}
export interface AddToCollectionResponseDto {
  collectionId: Tables<"collections">["id"];
  addedAt: Tables<"collections">["added_at"];
}

/**
 * Recommendation DTOs and Commands
 */
export interface RecommendationDto {
  id: Tables<"recommendations">["id"];
  // parsed array of game titles
  recommendations: string[];
  createdAt: Tables<"recommendations">["created_at"];
}
export type RecommendationsListResponseDto = ListResponseDto<RecommendationDto>;
export interface GenerateRecommendationsResponseDto {
  recommendations: string[];
}

/**
 * Rating DTOs and Commands
 */
export interface RatingDto {
  ratingId: Tables<"game_ratings">["id"];
  userId: Tables<"game_ratings">["user_id"];
  rating: Tables<"game_ratings">["rating"];
  comment: Tables<"game_ratings">["comment"];
  createdAt: Tables<"game_ratings">["created_at"];
}
export type RatingsListResponseDto = ListResponseDto<RatingDto>;
export interface RateGameCommand {
  rating: Tables<"game_ratings">["rating"];
  // optional because DB allows null
  comment?: Tables<"game_ratings">["comment"];
}
export type UpdateRatingCommand = RateGameCommand;
export type RateGameResponseDto = RatingDto;
export type UpdateRatingResponseDto = RatingDto;
