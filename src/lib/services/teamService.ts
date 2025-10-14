import type { SupabaseClient } from "../../db/supabase.client";
import type { CreateTeamCommand, CreateTeamResponse, CreateTeamValidated, Tables } from "../../types";
import { createTeamSchema } from "../../types";

/**
 * Team Service for managing team operations
 *
 * Provides functionality for:
 * - Creating new teams with validation
 * - Checking uniqueness constraints
 * - Handling team-related database operations
 */

export interface TeamConflictError {
  code: "TEAM_NAME_EXISTS" | "SHORT_CODE_EXISTS" | "BOTH_EXIST";
  message: string;
  conflicts: string[];
}

export interface TeamServiceError {
  code: "VALIDATION_ERROR" | "CONFLICT_ERROR" | "DATABASE_ERROR";
  message: string;
  details?: unknown;
}

export class TeamService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Creates a new team after validation and uniqueness checks
   */
  async createTeam(command: CreateTeamCommand): Promise<CreateTeamResponse> {
    try {
      // Validate input data using Zod schema
      const validatedData = await this.validateTeamData(command);

      // Check for existing teams with same name or short_code
      await this.checkTeamUniqueness(validatedData.name, validatedData.short_code);

      // Insert new team into database
      const newTeam = await this.insertTeam(validatedData);

      // Return formatted response
      return {
        id: newTeam.id,
        name: newTeam.name,
        short_code: newTeam.short_code,
        crest_url: newTeam.crest_url,
        is_active: newTeam.is_active,
        created_at: new Date().toISOString(),
        message: "Team created successfully",
      };
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Validates team data using Zod schema
   */
  private async validateTeamData(command: CreateTeamCommand): Promise<CreateTeamValidated> {
    try {
      return createTeamSchema.parse(command);
    } catch (error) {
      throw {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: error,
      } as TeamServiceError;
    }
  }

  /**
   * Checks if team name or short_code already exist
   * Throws TeamConflictError if conflicts found
   */
  private async checkTeamUniqueness(name: string, shortCode: string): Promise<void> {
    const { data: existingTeams, error } = await this.supabase
      .from("teams")
      .select("name, short_code")
      .or(`name.eq.${name},short_code.eq.${shortCode}`);

    if (error) {
      throw {
        code: "DATABASE_ERROR",
        message: "Failed to check team uniqueness",
        details: error,
      } as TeamServiceError;
    }

    if (existingTeams && existingTeams.length > 0) {
      const conflicts: string[] = [];
      let conflictCode: TeamConflictError["code"];

      const nameExists = existingTeams.some((team) => team.name === name);
      const shortCodeExists = existingTeams.some((team) => team.short_code === shortCode);

      if (nameExists && shortCodeExists) {
        conflicts.push("name", "short_code");
        conflictCode = "BOTH_EXIST";
      } else if (nameExists) {
        conflicts.push("name");
        conflictCode = "TEAM_NAME_EXISTS";
      } else {
        conflicts.push("short_code");
        conflictCode = "SHORT_CODE_EXISTS";
      }

      throw {
        code: conflictCode,
        message: "Team name or short code already in use",
        conflicts,
      } as TeamConflictError;
    }
  }

  /**
   * Inserts new team into database
   */
  private async insertTeam(data: CreateTeamValidated): Promise<Tables<"teams">> {
    const { data: newTeam, error } = await this.supabase
      .from("teams")
      .insert({
        name: data.name,
        short_code: data.short_code,
        crest_url: data.crest_url || null,
        is_active: data.is_active,
      })
      .select()
      .single();

    if (error) {
      throw {
        code: "DATABASE_ERROR",
        message: "Failed to create team",
        details: error,
      } as TeamServiceError;
    }

    if (!newTeam) {
      throw {
        code: "DATABASE_ERROR",
        message: "Team creation returned no data",
        details: null,
      } as TeamServiceError;
    }

    return newTeam;
  }

  /**
   * Handles and formats service errors
   */
  private handleServiceError(error: unknown): TeamServiceError {
    if ((error as TeamServiceError).code || (error as TeamConflictError).code) {
      return error as TeamServiceError;
    }

    // Handle unexpected errors
    return {
      code: "DATABASE_ERROR",
      message: "An unexpected error occurred while creating team",
      details: error,
    };
  }
}

/**
 * Factory function to create TeamService instance
 */
export function createTeamService(supabase: SupabaseClient): TeamService {
  return new TeamService(supabase);
}

/**
 * Formats TeamService errors for API responses
 */
export function formatTeamServiceError(error: TeamServiceError | TeamConflictError) {
  if ((error as TeamConflictError).conflicts) {
    const conflictError = error as TeamConflictError;
    return {
      status: 409,
      body: {
        error: "Team already exists",
        message: conflictError.message,
        conflicts: conflictError.conflicts,
      },
    };
  }

  const serviceError = error as TeamServiceError;

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

    case "DATABASE_ERROR":
      return {
        status: 500,
        body: {
          error: "Internal server error",
          message: "Unable to create team. Please try again later.",
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
