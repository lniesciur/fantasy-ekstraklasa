import type { APIRoute } from "astro";
import type { CreateTeamCommand, CreateTeamResponse } from "../../types";
import {
  createTeamService,
  formatTeamServiceError,
  type TeamServiceError,
  type TeamConflictError,
} from "../../lib/services/teamService";

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
    let requestData: CreateTeamCommand;
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

    // Create team service instance
    const teamService = createTeamService(locals.supabase);

    // Create team
    const result: CreateTeamResponse = await teamService.createTeam(requestData);

    // Return success response
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle known service errors
    if ((error as TeamServiceError).code || (error as TeamConflictError).code) {
      const errorResponse = formatTeamServiceError(error as TeamServiceError | TeamConflictError);
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
