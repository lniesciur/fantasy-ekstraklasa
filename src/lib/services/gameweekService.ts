import type { SupabaseClient } from "../../db/supabase.client";
import type { CreateGameweekCommand, CreateGameweekResponse, CreateGameweekValidated, Tables } from "../../types";
import { createGameweekSchema } from "../../types";

/**
 * Gameweek Service for managing gameweek operations
 *
 * Provides functionality for:
 * - Creating new gameweeks with validation
 * - Checking uniqueness constraints
 * - Computing gameweek status
 * - Handling gameweek-related database operations
 */

export interface GameweekConflictError {
  code: "GAMEWEEK_NUMBER_EXISTS";
  message: string;
  gameweek_number: number;
}

export interface GameweekServiceError {
  code: "VALIDATION_ERROR" | "CONFLICT_ERROR" | "DATABASE_ERROR";
  message: string;
  details?: unknown;
}

export class GameweekService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Creates a new gameweek after validation and uniqueness checks
   */
  async createGameweek(command: CreateGameweekCommand): Promise<CreateGameweekResponse> {
    try {
      // Validate input data using Zod schema
      const validatedData = await this.validateGameweekData(command);

      // Check for existing gameweek with same number
      await this.checkGameweekUniqueness(validatedData.number);

      // Insert new gameweek into database
      const newGameweek = await this.insertGameweek(validatedData);

      // Compute gameweek status
      const status = this.computeGameweekStatus(validatedData.start_date, validatedData.end_date);

      // Return formatted response
      return {
        id: newGameweek.id,
        number: newGameweek.number,
        start_date: newGameweek.start_date,
        end_date: newGameweek.end_date,
        status,
        created_at: newGameweek.created_at || new Date().toISOString(),
        message: "Gameweek created successfully",
      };
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Validates gameweek data using Zod schema
   */
  private async validateGameweekData(command: CreateGameweekCommand): Promise<CreateGameweekValidated> {
    try {
      return createGameweekSchema.parse(command);
    } catch (error) {
      throw {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: error,
      } as GameweekServiceError;
    }
  }

  /**
   * Checks if gameweek number already exists
   * Throws GameweekConflictError if conflict found
   */
  private async checkGameweekUniqueness(gameweekNumber: number): Promise<void> {
    const { data: existingGameweek, error } = await this.supabase
      .from("gameweeks")
      .select("number")
      .eq("number", gameweekNumber)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw {
        code: "DATABASE_ERROR",
        message: "Failed to check gameweek uniqueness",
        details: error,
      } as GameweekServiceError;
    }

    if (existingGameweek) {
      throw {
        code: "GAMEWEEK_NUMBER_EXISTS",
        message: "Gameweek number already exists",
        gameweek_number: gameweekNumber,
      } as GameweekConflictError;
    }
  }

  /**
   * Inserts new gameweek into database
   */
  private async insertGameweek(data: CreateGameweekValidated): Promise<Tables<"gameweeks">> {
    const { data: newGameweek, error } = await this.supabase
      .from("gameweeks")
      .insert({
        number: data.number,
        start_date: data.start_date,
        end_date: data.end_date,
      })
      .select()
      .single();

    if (error) {
      throw {
        code: "DATABASE_ERROR",
        message: "Failed to create gameweek",
        details: error,
      } as GameweekServiceError;
    }

    if (!newGameweek) {
      throw {
        code: "DATABASE_ERROR",
        message: "Gameweek creation returned no data",
        details: null,
      } as GameweekServiceError;
    }

    return newGameweek;
  }

  /**
   * Computes gameweek status based on current date and gameweek dates
   */
  private computeGameweekStatus(startDate: string, endDate: string): "upcoming" | "active" | "completed" {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "upcoming";
    } else if (now >= start && now <= end) {
      return "active";
    } else {
      return "completed";
    }
  }

  /**
   * Handles and formats service errors
   */
  private handleServiceError(error: unknown): GameweekServiceError {
    if ((error as GameweekServiceError).code || (error as GameweekConflictError).code) {
      return error as GameweekServiceError;
    }

    // Handle unexpected errors
    return {
      code: "DATABASE_ERROR",
      message: "An unexpected error occurred while creating gameweek",
      details: error,
    };
  }
}

/**
 * Factory function to create GameweekService instance
 */
export function createGameweekService(supabase: SupabaseClient): GameweekService {
  return new GameweekService(supabase);
}

/**
 * Formats GameweekService errors for API responses
 */
export function formatGameweekServiceError(error: GameweekServiceError | GameweekConflictError) {
  if ((error as GameweekConflictError).gameweek_number) {
    const conflictError = error as GameweekConflictError;
    return {
      status: 409,
      body: {
        error: "Gameweek already exists",
        message: conflictError.message,
        gameweek_number: conflictError.gameweek_number,
      },
    };
  }

  const serviceError = error as GameweekServiceError;

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
          message: "Unable to create gameweek. Please try again later.",
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
