import type { APIRoute } from "astro";
import { supabaseClient } from "../../../db/supabase.client";
import { createTemplateService, formatTemplateServiceError } from "../../../lib/services/templateService";

// Mark as non-prerendered for dynamic API route
export const prerender = false;

/**
 * GET /api/data/template
 *
 * Downloads Excel template file with current teams, players, and gameweeks data
 *
 * Response:
 * - 200: Excel file download
 * - 500: Server error
 */
export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Create Supabase client
    const supabase = supabaseClient;

    // Create template service and generate Excel file
    const templateService = createTemplateService(supabase);
    const excelBuffer = await templateService.generateExcelTemplate();

    // Generate filename with current year
    const currentYear = new Date().getFullYear();
    const filename = `fantasy_ekstraklasa_szablon_${currentYear}.xlsx`;

    // Return Excel file as download
    return new Response(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": excelBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Template download error:", error);

    // Handle template service errors
    if ((error as any).code) {
      const errorResponse = formatTemplateServiceError(error as any);
      return new Response(JSON.stringify(errorResponse.body), {
        status: errorResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Handle unexpected errors
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred while generating template",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
