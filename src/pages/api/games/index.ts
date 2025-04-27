import type { APIRoute } from "astro";
import { z } from "zod";
import { gamesService } from "../../../lib/services/games.service";
import { logger } from "../../../lib/logger";
import type { CreateGameCommand } from "../../../types";

export const prerender = false;

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  title: z.string().optional(),
  minPlayers: z.string().optional(),
  maxPlayers: z.string().optional(),
  categories: z.string().optional(),
  mechanics: z.string().optional(),
  sortBy: z.enum(["title", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

const createGameSchema = z
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

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    // Validate query parameters
    const validationResult = querySchema.safeParse(query);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    // Convert and set default values
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 20;
    const minPlayers = query.minPlayers ? parseInt(query.minPlayers) : undefined;
    const maxPlayers = query.maxPlayers ? parseInt(query.maxPlayers) : undefined;
    const categories = query.categories ? query.categories.split(",").map(Number) : undefined;
    const mechanics = query.mechanics ? query.mechanics.split(",").map(Number) : undefined;
    const sortBy = (query.sortBy || "title") as "title" | "createdAt";
    const order = (query.order || "asc") as "asc" | "desc";

    const filters = {
      page,
      limit,
      title: query.title,
      minPlayers,
      maxPlayers,
      categories,
      mechanics,
      sortBy,
      order,
    };

    // Call the service layer to get the list of games
    const gamesList = await gamesService.getGames(filters);
    return new Response(JSON.stringify(gamesList), { status: 200 });
  } catch (error) {
    logger.error("GET /api/games error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or invalid Authorization header" }), { status: 401 });
    }

    // Parse and validate request body
    let body: CreateGameCommand;
    try {
      body = await request.json();
    } catch (e: unknown) {
      const error = e instanceof Error ? e.message : "Unknown error parsing JSON";
      return new Response(JSON.stringify({ error: "Invalid JSON in request body", details: error }), { status: 400 });
    }

    const bodyValidation = createGameSchema.safeParse(body);
    if (!bodyValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: bodyValidation.error.format(),
        }),
        { status: 400 }
      );
    }

    // Create the game
    const game = await gamesService.createGame(bodyValidation.data);
    return new Response(JSON.stringify(game), { status: 201 });
  } catch (error) {
    logger.error("POST /api/games error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
