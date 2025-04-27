// Add import for CreateGameCommand type
import type { CreateGameCommand, UpdateGameCommand } from "../../types";
import { supabaseClient } from "../../db/supabase.client";
import { logger } from "../logger";

// Add new interface for game filters
interface GamesFilters {
  page: number;
  limit: number;
  title?: string;
  minPlayers?: number;
  maxPlayers?: number;
  categories?: number[];
  mechanics?: number[];
  sortBy: "title" | "createdAt";
  order: "asc" | "desc";
}

export const gamesService = {
  getGames: async (filters: GamesFilters) => {
    const { page, limit, title, minPlayers, maxPlayers, categories, mechanics, sortBy, order } = filters;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from("games")
      .select("*, categories:game_categories(*), mechanics:game_mechanics(*)", { count: "exact" });

    // Apply filters
    if (title) {
      query = query.ilike("tytul", `%${title}%`);
    }
    if (minPlayers) {
      query = query.gte("min_graczy", minPlayers);
    }
    if (maxPlayers) {
      query = query.lte("max_graczy", maxPlayers);
    }
    if (categories?.length) {
      query = query.in("game_categories.category_id", categories);
    }
    if (mechanics?.length) {
      query = query.in("game_mechanics.mechanic_id", mechanics);
    }

    // Apply sorting and pagination
    query = query
      .order(sortBy === "title" ? "tytul" : "created_at", { ascending: order === "asc" })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      logger.error("Error fetching games:", error);
      throw error;
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    };
  },
  getGameById: async (id: number) => {
    const { data, error } = await supabaseClient
      .from("games")
      .select("*, categories:game_categories(*), mechanics:game_mechanics(*)")
      .eq("id", id)
      .single();

    if (error) {
      logger.error("Error fetching game:", error);
      return null;
    }

    return data;
  },
  createGame: async (cmd: CreateGameCommand) => {
    const { data: game, error: gameError } = await supabaseClient
      .from("games")
      .insert({
        tytul: cmd.title,
        wydawca: cmd.publisher,
        min_graczy: cmd.minPlayers,
        max_graczy: cmd.maxPlayers,
        czas_rozgrywki: cmd.playTime,
      })
      .select()
      .single();

    if (gameError || !game) {
      logger.error("Error creating game:", gameError);
      throw gameError;
    }

    // Add categories and mechanics
    if (cmd.categoryIds.length > 0) {
      const { error: categoriesError } = await supabaseClient.from("game_categories").insert(
        cmd.categoryIds.map((categoryId) => ({
          game_id: game.id,
          category_id: categoryId,
        }))
      );

      if (categoriesError) {
        logger.error("Error adding categories:", categoriesError);
        throw categoriesError;
      }
    }

    if (cmd.mechanicIds.length > 0) {
      const { error: mechanicsError } = await supabaseClient.from("game_mechanics").insert(
        cmd.mechanicIds.map((mechanicId) => ({
          game_id: game.id,
          mechanic_id: mechanicId,
        }))
      );

      if (mechanicsError) {
        logger.error("Error adding mechanics:", mechanicsError);
        throw mechanicsError;
      }
    }

    // Fetch the complete game with relations
    return await gamesService.getGameById(game.id);
  },
  updateGame: async (id: number, cmd: UpdateGameCommand, userId: string) => {
    // Check if game exists and user has access
    const { data: existingGame, error: checkError } = await supabaseClient
      .from("games")
      .select()
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (checkError || !existingGame) {
      logger.error("Error checking game:", checkError);
      return null;
    }

    // Update game details
    const { error: updateError } = await supabaseClient
      .from("games")
      .update({
        tytul: cmd.title,
        wydawca: cmd.publisher,
        min_graczy: cmd.minPlayers,
        max_graczy: cmd.maxPlayers,
        czas_rozgrywki: cmd.playTime,
      })
      .eq("id", id);

    if (updateError) {
      logger.error("Error updating game:", updateError);
      throw updateError;
    }

    // Update categories
    await supabaseClient.from("game_categories").delete().eq("game_id", id);

    if (cmd.categoryIds.length > 0) {
      const { error: categoriesError } = await supabaseClient.from("game_categories").insert(
        cmd.categoryIds.map((categoryId) => ({
          game_id: id,
          category_id: categoryId,
        }))
      );

      if (categoriesError) {
        logger.error("Error updating categories:", categoriesError);
        throw categoriesError;
      }
    }

    // Update mechanics
    await supabaseClient.from("game_mechanics").delete().eq("game_id", id);

    if (cmd.mechanicIds.length > 0) {
      const { error: mechanicsError } = await supabaseClient.from("game_mechanics").insert(
        cmd.mechanicIds.map((mechanicId) => ({
          game_id: id,
          mechanic_id: mechanicId,
        }))
      );

      if (mechanicsError) {
        logger.error("Error updating mechanics:", mechanicsError);
        throw mechanicsError;
      }
    }

    // Return updated game with relations
    return await gamesService.getGameById(id);
  },
  deleteGame: async (id: number, userId: string) => {
    // Check if game exists and user has access
    const { data: game, error: checkError } = await supabaseClient
      .from("games")
      .select()
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (checkError || !game) {
      logger.error("Error checking game:", checkError);
      return false;
    }

    // Delete related records first
    await supabaseClient.from("game_categories").delete().eq("game_id", id);

    await supabaseClient.from("game_mechanics").delete().eq("game_id", id);

    // Delete the game
    const { error: deleteError } = await supabaseClient.from("games").delete().eq("id", id);

    if (deleteError) {
      logger.error("Error deleting game:", deleteError);
      return false;
    }

    return true;
  },
};
