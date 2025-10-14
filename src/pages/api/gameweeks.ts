import type { APIRoute } from "astro";
import type { CreateGameweekCommand, CreateGameweekResponse } from "../../types";
import {
  createGameweekService,
  formatGameweekServiceError,
  type GameweekServiceError,
  type GameweekConflictError,
} from "../../lib/services/gameweekService";

// Oznacz jako nie-prerendered dla dynamicznych API route
export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Sprawdź Content-Type
    const contentType = request.headers.get("Content-Type");
    if (!contentType?.includes("application/json")) {
      return new Response(
        JSON.stringify({
          error: "Invalid Content-Type",
          message: "Content-Type must be application/json",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    let requestData: CreateGameweekCommand;
    try {
      requestData = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON",
          message: "Request body must be valid JSON",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate required fields exist
    if (!requestData || typeof requestData !== "object") {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          message: "Request body must be a JSON object",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get Supabase client from locals (injected by middleware)
    if (!locals.supabase) {
      return new Response(
        JSON.stringify({
          error: "Internal server error",
          message: "Database connection not available",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create gameweek service instance
    const gameweekService = createGameweekService(locals.supabase);

    // Create gameweek
    const result: CreateGameweekResponse = await gameweekService.createGameweek(requestData);

    // Return success response
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle known service errors
    if ((error as GameweekServiceError).code || (error as GameweekConflictError).code) {
      const errorResponse = formatGameweekServiceError(error as GameweekServiceError | GameweekConflictError);
      return new Response(JSON.stringify(errorResponse.body), {
        status: errorResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle unexpected errors
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
