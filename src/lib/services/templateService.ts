import type { SupabaseClient } from "../../db/supabase.client";
import type { TeamDto, PlayerDto, GameweekDto } from "../../types";
import * as XLSX from "xlsx";

/**
 * Template Service for generating Excel templates
 *
 * Provides functionality for:
 * - Generating Excel templates with current data
 * - Fetching teams, players, and gameweeks for template
 * - Creating structured Excel files for data import
 */

export interface TemplateData {
  teams: TeamDto[];
  players: PlayerDto[];
  gameweeks: GameweekDto[];
}

export interface TemplateServiceError {
  code: "DATABASE_ERROR" | "GENERATION_ERROR" | "AUTHENTICATION_ERROR";
  message: string;
  details?: unknown;
}

export class TemplateService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Generates Excel template with current teams, players, and gameweeks data
   */
  async generateExcelTemplate(): Promise<Buffer> {
    try {
      // Fetch template data from database
      const templateData = await this.fetchTemplateData();

      // Generate Excel workbook
      const workbook = this.createExcelWorkbook(templateData);

      // Convert to buffer
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      return buffer;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Fetches all data needed for template generation
   */
  private async fetchTemplateData(): Promise<TemplateData> {
    // Fetch teams
    const { data: teams, error: teamsError } = await this.supabase
      .from("teams")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (teamsError) {
      throw {
        code: "DATABASE_ERROR",
        message: "Failed to fetch teams",
        details: teamsError,
      } as TemplateServiceError;
    }

    // Fetch players with team information
    const { data: players, error: playersError } = await this.supabase
      .from("players")
      .select(
        `
        id,
        name,
        position,
        price,
        health_status,
        teams!inner (
          id,
          name,
          short_code,
          crest_url
        )
      `
      )
      .order("name");

    if (playersError) {
      throw {
        code: "DATABASE_ERROR",
        message: "Failed to fetch players",
        details: playersError,
      } as TemplateServiceError;
    }

    // Fetch gameweeks
    const { data: gameweeks, error: gameweeksError } = await this.supabase
      .from("gameweeks")
      .select("*")
      .order("number");

    if (gameweeksError) {
      throw {
        code: "DATABASE_ERROR",
        message: "Failed to fetch gameweeks",
        details: gameweeksError,
      } as TemplateServiceError;
    }

    return {
      teams: teams || [],
      players: (players || []).map((player) => ({
        id: player.id,
        name: player.name,
        position: player.position as "GK" | "DEF" | "MID" | "FWD",
        price: player.price,
        health_status: player.health_status as "Pewny" | "Wątpliwy" | "Nie zagra",
        team: {
          id: player.teams.id,
          name: player.teams.name,
          short_code: player.teams.short_code,
          crest_url: player.teams.crest_url,
        },
        current_stats: {
          fantasy_points: 0,
          form: 0,
          minutes_played: 0,
          goals: 0,
          assists: 0,
          yellow_cards: 0,
          red_cards: 0,
          predicted_start: false,
        },
      })),
      gameweeks: gameweeks || [],
    };
  }

  /**
   * Creates Excel workbook with multiple sheets
   */
  private createExcelWorkbook(data: TemplateData): XLSX.WorkBook {
    const workbook = XLSX.utils.book_new();

    // Create Teams sheet
    const teamsSheet = this.createTeamsSheet(data.teams);
    XLSX.utils.book_append_sheet(workbook, teamsSheet, "Teams");

    // Create Players sheet
    const playersSheet = this.createPlayersSheet(data.players);
    XLSX.utils.book_append_sheet(workbook, playersSheet, "Players");

    // Create Gameweeks sheet
    const gameweeksSheet = this.createGameweeksSheet(data.gameweeks);
    XLSX.utils.book_append_sheet(workbook, gameweeksSheet, "Gameweeks");

    // Create Import Template sheet
    const importTemplateSheet = this.createImportTemplateSheet();
    XLSX.utils.book_append_sheet(workbook, importTemplateSheet, "Import Template");

    return workbook;
  }

  /**
   * Creates Teams sheet with team data
   */
  private createTeamsSheet(teams: TeamDto[]): any[][] {
    const header = ["ID", "Name", "Short Code", "Crest URL", "Is Active"];
    const rows = teams.map((team) => [team.id, team.name, team.short_code, team.crest_url || "", team.is_active]);

    return [header, ...rows];
  }

  /**
   * Creates Players sheet with player data
   */
  private createPlayersSheet(players: PlayerDto[]): any[][] {
    const header = ["ID", "Name", "Team ID", "Team Name", "Position", "Price", "Health Status"];
    const rows = players.map((player) => [
      player.id,
      player.name,
      player.team.id,
      player.team.name,
      player.position,
      player.price,
      player.health_status,
    ]);

    return [header, ...rows];
  }

  /**
   * Creates Gameweeks sheet with gameweek data
   */
  private createGameweeksSheet(gameweeks: GameweekDto[]): any[][] {
    const header = ["ID", "Number", "Start Date", "End Date"];
    const rows = gameweeks.map((gameweek) => [gameweek.id, gameweek.number, gameweek.start_date, gameweek.end_date]);

    return [header, ...rows];
  }

  /**
   * Creates Import Template sheet with example data structure
   */
  private createImportTemplateSheet(): any[][] {
    const header = [
      "Name",
      "Team",
      "Position",
      "Price",
      "Health Status",
      "Fantasy Points",
      "Goals",
      "Assists",
      "Lotto Assists",
      "Penalties Scored",
      "Penalties Caused",
      "Penalties Missed",
      "Yellow Cards",
      "Red Cards",
      "Minutes Played",
      "In Team of Week",
      "Predicted Start",
    ];

    const exampleRow = [
      "Example Player",
      "Example Team",
      "MID",
      "5000000",
      "Pewny",
      "10",
      "2",
      "1",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "90",
      "false",
      "true",
    ];

    const instructions = [
      "",
      "INSTRUCTIONS:",
      "1. Fill in player data in the rows below",
      "2. Use exact team names from Teams sheet",
      "3. Position must be: GK, DEF, MID, or FWD",
      "4. Health Status must be: Pewny, Wątpliwy, or Nie zagra",
      "5. All numeric fields should be numbers",
      "6. Boolean fields should be: true or false",
      "7. Save as .xlsx file for import",
    ];

    return [header, exampleRow, ...instructions.map((instruction) => [instruction])];
  }

  /**
   * Handles and formats service errors
   */
  private handleServiceError(error: unknown): TemplateServiceError {
    if ((error as TemplateServiceError).code) {
      return error as TemplateServiceError;
    }

    // Handle unexpected errors
    return {
      code: "GENERATION_ERROR",
      message: "An unexpected error occurred while generating template",
      details: error,
    };
  }
}

/**
 * Factory function to create TemplateService instance
 */
export function createTemplateService(supabase: SupabaseClient): TemplateService {
  return new TemplateService(supabase);
}

/**
 * Formats TemplateService errors for API responses
 */
export function formatTemplateServiceError(error: TemplateServiceError) {
  switch (error.code) {
    case "DATABASE_ERROR":
      return {
        status: 500,
        body: {
          error: "Database error",
          message: "Failed to fetch template data. Please try again later.",
        },
      };

    case "GENERATION_ERROR":
      return {
        status: 500,
        body: {
          error: "Generation error",
          message: "Failed to generate Excel template. Please try again later.",
        },
      };

    case "AUTHENTICATION_ERROR":
      return {
        status: 401,
        body: {
          error: "Authentication required",
          message: "Valid authentication token required to download template.",
        },
      };

    default:
      return {
        status: 500,
        body: {
          error: "Internal server error",
          message: "An unexpected error occurred",
        },
      };
  }
}
