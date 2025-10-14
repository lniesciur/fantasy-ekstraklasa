import type { SupabaseClient } from "../../db/supabase.client";
import type { CreatePlayerCommand, CreatePlayerResponse, CreatePlayerValidated, Tables } from "../../types";
import { createPlayerSchema } from "../../types";

/**
 * Player Service for managing player operations
 *
 * Provides functionality for:
 * - Creating new players with validation
 * - Checking team existence and player uniqueness
 * - Handling player-related database operations
 */

export interface PlayerConflictError {
  code: "PLAYER_NAME_EXISTS_IN_TEAM";
  message: string;
  team_id: number;
  player_name: string;
}

export interface PlayerServiceError {
  code: "VALIDATION_ERROR" | "TEAM_NOT_FOUND" | "CONFLICT_ERROR" | "DATABASE_ERROR";
  message: string;
  details?: unknown;
}

export class PlayerService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Creates a new player after validation and uniqueness checks
   */
  async createPlayer(command: CreatePlayerCommand): Promise<CreatePlayerResponse> {
    try {
      // Validate input data using Zod schema
      const validatedData = await this.validatePlayerData(command);

      // Check if team exists
      await this.validateTeamExists(validatedData.team_id);

      // Check for existing player with same name in the same team
      await this.checkPlayerUniqueness(validatedData.name, validatedData.team_id);

      // Insert new player into database
      const newPlayer = await this.insertPlayer(validatedData);

      // Get team information for response
      const teamInfo = await this.getTeamInfo(validatedData.team_id);

      // Return formatted response
      return {
        id: newPlayer.id,
        name: newPlayer.name,
        team: {
          id: teamInfo.id,
          name: teamInfo.name,
          short_code: teamInfo.short_code,
          crest_url: teamInfo.crest_url,
        },
        position: newPlayer.position as "GK" | "DEF" | "MID" | "FWD",
        price: newPlayer.price,
        health_status: newPlayer.health_status as "Pewny" | "Wątpliwy" | "Nie zagra",
        created_at: newPlayer.created_at || new Date().toISOString(),
        message: "Player created successfully",
      };
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Validates player data using Zod schema
   */
  private async validatePlayerData(command: CreatePlayerCommand): Promise<CreatePlayerValidated> {
    try {
      return createPlayerSchema.parse(command);
    } catch (error) {
      throw {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: error,
      } as PlayerServiceError;
    }
  }

  /**
   * Validates that the team exists in the database
   */
  private async validateTeamExists(teamId: number): Promise<void> {
    const { data: team, error } = await this.supabase.from("teams").select("id").eq("id", teamId).single();

    if (error || !team) {
      throw {
        code: "TEAM_NOT_FOUND",
        message: "Team not found",
        details: { team_id: teamId },
      } as PlayerServiceError;
    }
  }

  /**
   * Checks if player name already exists in the same team
   * Throws PlayerConflictError if conflict found
   */
  private async checkPlayerUniqueness(playerName: string, teamId: number): Promise<void> {
    const { data: existingPlayer, error } = await this.supabase
      .from("players")
      .select("name, team_id")
      .eq("name", playerName)
      .eq("team_id", teamId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw {
        code: "DATABASE_ERROR",
        message: "Failed to check player uniqueness",
        details: error,
      } as PlayerServiceError;
    }

    if (existingPlayer) {
      throw {
        code: "PLAYER_NAME_EXISTS_IN_TEAM",
        message: "Player name already exists in this team",
        team_id: teamId,
        player_name: playerName,
      } as PlayerConflictError;
    }
  }

  /**
   * Inserts new player into database
   */
  private async insertPlayer(data: CreatePlayerValidated): Promise<Tables<"players">> {
    const { data: newPlayer, error } = await this.supabase
      .from("players")
      .insert({
        name: data.name,
        team_id: data.team_id,
        position: data.position,
        price: data.price,
        health_status: data.health_status,
      })
      .select()
      .single();

    if (error) {
      throw {
        code: "DATABASE_ERROR",
        message: "Failed to create player",
        details: error,
      } as PlayerServiceError;
    }

    if (!newPlayer) {
      throw {
        code: "DATABASE_ERROR",
        message: "Player creation returned no data",
        details: null,
      } as PlayerServiceError;
    }

    return newPlayer;
  }

  /**
   * Gets team information for response
   */
  private async getTeamInfo(
    teamId: number
  ): Promise<Pick<Tables<"teams">, "id" | "name" | "short_code" | "crest_url">> {
    const { data: team, error } = await this.supabase
      .from("teams")
      .select("id, name, short_code, crest_url")
      .eq("id", teamId)
      .single();

    if (error || !team) {
      throw {
        code: "DATABASE_ERROR",
        message: "Failed to retrieve team information",
        details: error,
      } as PlayerServiceError;
    }

    return team;
  }

  /**
   * Handles and formats service errors
   */
  private handleServiceError(error: unknown): PlayerServiceError {
    if ((error as PlayerServiceError).code || (error as PlayerConflictError).code) {
      return error as PlayerServiceError;
    }

    // Handle unexpected errors
    return {
      code: "DATABASE_ERROR",
      message: "An unexpected error occurred while creating player",
      details: error,
    };
  }
}

/**
 * Factory function to create PlayerService instance
 */
export function createPlayerService(supabase: SupabaseClient): PlayerService {
  return new PlayerService(supabase);
}

/**
 * Formats PlayerService errors for API responses
 */
export function formatPlayerServiceError(error: PlayerServiceError | PlayerConflictError) {
  if ((error as PlayerConflictError).team_id) {
    const conflictError = error as PlayerConflictError;
    return {
      status: 409,
      body: {
        error: "Player already exists",
        message: conflictError.message,
        team_id: conflictError.team_id,
        player_name: conflictError.player_name,
      },
    };
  }

  const serviceError = error as PlayerServiceError;

  switch (serviceError.code) {
    case "VALIDATION_ERROR":
      return {
        status: 400,
        body: {
          error: "Validation failed",
          message: serviceError.message,
          details: serviceError.details,
        },
      };

    case "TEAM_NOT_FOUND":
      return {
        status: 400,
        body: {
          error: "Team not found",
          message: serviceError.message,
          details: serviceError.details,
        },
      };

    case "DATABASE_ERROR":
      return {
        status: 500,
        body: {
          error: "Internal server error",
          message: "Unable to create player. Please try again later.",
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
