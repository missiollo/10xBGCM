import type { APIRoute } from "astro";
import { z } from "zod";
import { gamesService } from "../../../lib/services/games.service";
import { logger } from "../../../lib/logger";

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
