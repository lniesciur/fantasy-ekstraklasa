import { supabaseClient } from "../../db/supabase.client";
import type { 
  CreateMatchCommand, 
  CreateMatchResponse, 
  Tables, 
  TablesInsert 
} from "../../types";

export class MatchService {
  /**
   * Creates a new match in the database
   * @param command - The match creation command
   * @returns Promise<CreateMatchResponse> - The created match with team details
   * @throws Error if validation fails or database operation fails
   */
  async createMatch(command: CreateMatchCommand): Promise<CreateMatchResponse> {
    try {
      // 1. Validate gameweek exists
      await this.validateGameweek(command.gameweek_id);
      
      // 2. Validate teams exist and get team details
      const teams = await this.validateTeams([command.home_team_id, command.away_team_id]);
      
      // 3. Check for duplicate match
      await this.checkDuplicateMatch(command);
      
      // 4. Insert match into database
      const match = await this.insertMatch(command);
      
      // 5. Format and return response
      return this.formatMatchResponse(match, teams);
      
    } catch (error) {
      console.error("Error creating match:", error);
      throw error;
    }
  }

  /**
   * Validates that the gameweek exists
   * @param gameweekId - The gameweek ID to validate
   * @throws Error if gameweek doesn't exist
   */
  private async validateGameweek(gameweekId: number): Promise<void> {
    const { data, error } = await supabaseClient
      .from("gameweeks")
      .select("id")
      .eq("id", gameweekId)
      .single();

    if (error || !data) {
      throw new Error(`Gameweek with ID ${gameweekId} not found`);
    }
  }

  /**
   * Validates that teams exist and returns team details
   * @param teamIds - Array of team IDs to validate
   * @returns Promise<Team[]> - Array of team details
   * @throws Error if any team doesn't exist
   */
  private async validateTeams(teamIds: number[]): Promise<Tables<"teams">[]> {
    const { data, error } = await supabaseClient
      .from("teams")
      .select("id, name, short_code")
      .in("id", teamIds);

    if (error) {
      throw new Error(`Database error while validating teams: ${error.message}`);
    }

    if (!data || data.length !== teamIds.length) {
      const foundIds = data?.map(team => team.id) || [];
      const missingIds = teamIds.filter(id => !foundIds.includes(id));
      throw new Error(`Teams with IDs ${missingIds.join(", ")} not found`);
    }

    return data;
  }

  /**
   * Checks for duplicate matches (same teams in same gameweek)
   * @param command - The match creation command
   * @throws Error if duplicate match exists
   */
  private async checkDuplicateMatch(command: CreateMatchCommand): Promise<void> {
    const { data, error } = await supabaseClient
      .from("matches")
      .select("id")
      .eq("gameweek_id", command.gameweek_id)
      .or(`and(home_team_id.eq.${command.home_team_id},away_team_id.eq.${command.away_team_id}),and(home_team_id.eq.${command.away_team_id},away_team_id.eq.${command.home_team_id})`);

    if (error) {
      throw new Error(`Database error while checking for duplicates: ${error.message}`);
    }

    if (data && data.length > 0) {
      throw new Error(`Match between teams ${command.home_team_id} and ${command.away_team_id} already exists in gameweek ${command.gameweek_id}`);
    }
  }

  /**
   * Inserts the match into the database
   * @param command - The match creation command
   * @returns Promise<Tables<"matches">> - The created match record
   * @throws Error if database insertion fails
   */
  private async insertMatch(command: CreateMatchCommand): Promise<Tables<"matches">> {
    const matchData: TablesInsert<"matches"> = {
      gameweek_id: command.gameweek_id,
      home_team_id: command.home_team_id,
      away_team_id: command.away_team_id,
      match_date: command.match_date,
      status: command.status
    };

    const { data, error } = await supabaseClient
      .from("matches")
      .insert(matchData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create match: ${error.message}`);
    }

    if (!data) {
      throw new Error("Match creation failed - no data returned");
    }

    return data;
  }

  /**
   * Formats the match response with team details
   * @param match - The created match record
   * @param teams - Array of team details
   * @returns CreateMatchResponse - Formatted response
   */
  private formatMatchResponse(match: Tables<"matches">, teams: Tables<"teams">[]): CreateMatchResponse {
    const homeTeam = teams.find(team => team.id === match.home_team_id);
    const awayTeam = teams.find(team => team.id === match.away_team_id);

    if (!homeTeam || !awayTeam) {
      throw new Error("Team details not found for created match");
    }

    return {
      id: match.id,
      gameweek_id: match.gameweek_id,
      home_team: {
        id: homeTeam.id,
        name: homeTeam.name,
        short_code: homeTeam.short_code
      },
      away_team: {
        id: awayTeam.id,
        name: awayTeam.name,
        short_code: awayTeam.short_code
      },
      match_date: match.match_date,
      status: match.status,
      created_at: match.created_at,
      message: "Match created successfully"
    };
  }
}
