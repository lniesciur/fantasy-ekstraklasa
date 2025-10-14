import type { APIRoute } from "astro";
import type { CreatePlayerCommand, CreatePlayerResponse } from "../../types";
import {
  createPlayerService,
  formatPlayerServiceError,
  type PlayerServiceError,
  type PlayerConflictError,
} from "../../lib/services/playerService";

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
    let requestData: CreatePlayerCommand;
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

    // Create player service instance
    const playerService = createPlayerService(locals.supabase);

    // Create player
    const result: CreatePlayerResponse = await playerService.createPlayer(requestData);

    // Return success response
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle known service errors
    if ((error as PlayerServiceError).code || (error as PlayerConflictError).code) {
      const errorResponse = formatPlayerServiceError(error as PlayerServiceError | PlayerConflictError);
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
