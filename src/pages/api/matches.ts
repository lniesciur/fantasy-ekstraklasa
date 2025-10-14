import type { APIRoute } from "astro";
import { MatchService } from "../../lib/services/matchService";
import { createMatchSchema, type CreateMatchCommand } from "../../types";

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Invalid JSON in request body",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 2. Validate request body against schema
    const validationResult = createMatchSchema.safeParse(requestBody);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return new Response(
        JSON.stringify({
          error: "Validation Error",
          message: "Invalid input data",
          details: errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const command: CreateMatchCommand = validationResult.data;

    // 3. Create match using service
    const matchService = new MatchService();
    const result = await matchService.createMatch(command);

    // 4. Return success response
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in matches API:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // Check for specific error messages to return appropriate status codes
      if (error.message.includes("not found")) {
        return new Response(
          JSON.stringify({
            error: "Not Found",
            message: error.message,
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (error.message.includes("already exists") || error.message.includes("duplicate")) {
        return new Response(
          JSON.stringify({
            error: "Conflict",
            message: error.message,
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (error.message.includes("Database error")) {
        return new Response(
          JSON.stringify({
            error: "Internal Server Error",
            message: "Database operation failed",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Generic server error
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// Handle unsupported methods
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error: "Method Not Allowed",
      message: "GET method not supported for this endpoint",
    }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const PUT: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error: "Method Not Allowed",
      message: "PUT method not supported for this endpoint",
    }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const DELETE: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error: "Method Not Allowed",
      message: "DELETE method not supported for this endpoint",
    }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    }
  );
};
