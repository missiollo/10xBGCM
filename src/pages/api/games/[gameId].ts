import type { APIRoute } from "astro";
import { z } from "zod";
import { gamesService } from "../../../lib/services/games.service";
import type { UpdateGameCommand } from "../../../types";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";
import { logger } from "../../../lib/logger";

export const prerender = false;

const paramsSchema = z.object({
  gameId: z.string(),
});

// Schema for validating the update game request body
const updateGameSchema = z
  .object({
    title: z.string(),
    publisher: z.string().optional(),
    minPlayers: z.number().min(1),
    maxPlayers: z.number().min(1),
    playTime: z.number().optional(),
    categoryIds: z.array(z.number()),
    mechanicIds: z.array(z.number()),
  })
  .refine((data) => data.minPlayers <= data.maxPlayers, {
    message: "minPlayers must be less than or equal to maxPlayers",
  });

export const GET: APIRoute = async ({ params }) => {
  try {
    const validationResult = paramsSchema.safeParse(params);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid parameters",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const { gameId } = validationResult.data;
    const parsedGameId = parseInt(gameId);

    const game = await gamesService.getGameById(parsedGameId);
    if (!game) {
      return new Response(JSON.stringify({ error: "Game not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(game), { status: 200 });
  } catch (error) {
    logger.error("GET /api/games/{gameId} error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    // Check Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or invalid Authorization header" }), { status: 401 });
    }

    // Validate route parameters
    const paramsValidation = paramsSchema.safeParse(params);
    if (!paramsValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid parameters",
          details: paramsValidation.error.format(),
        }),
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body: UpdateGameCommand;
    try {
      body = await request.json();
    } catch (e: unknown) {
      const error = e instanceof Error ? e.message : "Unknown error parsing JSON";
      return new Response(JSON.stringify({ error: "Invalid JSON in request body", details: error }), { status: 400 });
    }

    const bodyValidation = updateGameSchema.safeParse(body);
    if (!bodyValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: bodyValidation.error.format(),
        }),
        { status: 400 }
      );
    }

    const { gameId } = paramsValidation.data;
    const parsedGameId = parseInt(gameId);

    // Update the game
    const updatedGame = await gamesService.updateGame(parsedGameId, bodyValidation.data, DEFAULT_USER_ID);
    if (!updatedGame) {
      return new Response(JSON.stringify({ error: "Game not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedGame), { status: 200 });
  } catch (error) {
    logger.error("PUT /api/games/{gameId} error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    // Check Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or invalid Authorization header" }), { status: 401 });
    }

    // Validate route parameters
    const validationResult = paramsSchema.safeParse(params);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid parameters",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const { gameId } = validationResult.data;
    const parsedGameId = parseInt(gameId);

    // Attempt to delete the game
    const deleted = await gamesService.deleteGame(parsedGameId, DEFAULT_USER_ID);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Game not found" }), { status: 404 });
    }

    // Return 204 No Content for successful deletion
    return new Response(null, { status: 204 });
  } catch (error) {
    logger.error("DELETE /api/games/{gameId} error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
