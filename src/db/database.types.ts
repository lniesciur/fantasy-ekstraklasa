export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      bonuses: {
        Row: {
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          description?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      gameweeks: {
        Row: {
          end_date: string;
          id: number;
          number: number;
          start_date: string;
        };
        Insert: {
          end_date: string;
          id?: number;
          number: number;
          start_date: string;
        };
        Update: {
          end_date?: string;
          id?: number;
          number?: number;
          start_date?: string;
        };
        Relationships: [];
      };
      generation_logs: {
        Row: {
          created_at: string | null;
          error_message: string | null;
          gameweek_id: number | null;
          generation_time: number;
          id: number;
          lineup_id: string | null;
          model: string;
          success: boolean;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          error_message?: string | null;
          gameweek_id?: number | null;
          generation_time: number;
          id?: number;
          lineup_id?: string | null;
          model: string;
          success: boolean;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          error_message?: string | null;
          gameweek_id?: number | null;
          generation_time?: number;
          id?: number;
          lineup_id?: string | null;
          model?: string;
          success?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generation_logs_gameweek_id_fkey";
            columns: ["gameweek_id"];
            isOneToOne: false;
            referencedRelation: "gameweeks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generation_logs_lineup_id_fkey";
            columns: ["lineup_id"];
            isOneToOne: false;
            referencedRelation: "lineups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generation_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      import_logs: {
        Row: {
          completed_at: string | null;
          error_message: string | null;
          errors_count: number | null;
          file_size: number;
          filename: string;
          gameweek_id: number | null;
          id: string;
          import_results: Json | null;
          import_type: string;
          overwrite_mode: string;
          players_created: number | null;
          players_imported: number | null;
          players_total: number | null;
          players_updated: number | null;
          started_at: string | null;
          status: string;
          user_id: string;
          validation_id: string | null;
          validation_results: Json | null;
          warnings_count: number | null;
        };
        Insert: {
          completed_at?: string | null;
          error_message?: string | null;
          errors_count?: number | null;
          file_size: number;
          filename: string;
          gameweek_id?: number | null;
          id?: string;
          import_results?: Json | null;
          import_type?: string;
          overwrite_mode: string;
          players_created?: number | null;
          players_imported?: number | null;
          players_total?: number | null;
          players_updated?: number | null;
          started_at?: string | null;
          status: string;
          user_id: string;
          validation_id?: string | null;
          validation_results?: Json | null;
          warnings_count?: number | null;
        };
        Update: {
          completed_at?: string | null;
          error_message?: string | null;
          errors_count?: number | null;
          file_size?: number;
          filename?: string;
          gameweek_id?: number | null;
          id?: string;
          import_results?: Json | null;
          import_type?: string;
          overwrite_mode?: string;
          players_created?: number | null;
          players_imported?: number | null;
          players_total?: number | null;
          players_updated?: number | null;
          started_at?: string | null;
          status?: string;
          user_id?: string;
          validation_id?: string | null;
          validation_results?: Json | null;
          warnings_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "import_logs_gameweek_id_fkey";
            columns: ["gameweek_id"];
            isOneToOne: false;
            referencedRelation: "gameweeks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "import_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      lineup_bonuses: {
        Row: {
          applied_at: string | null;
          bonus_id: number;
          id: number;
          lineup_id: string;
        };
        Insert: {
          applied_at?: string | null;
          bonus_id: number;
          id?: number;
          lineup_id: string;
        };
        Update: {
          applied_at?: string | null;
          bonus_id?: number;
          id?: number;
          lineup_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lineup_bonuses_bonus_id_fkey";
            columns: ["bonus_id"];
            isOneToOne: false;
            referencedRelation: "bonuses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lineup_bonuses_lineup_id_fkey";
            columns: ["lineup_id"];
            isOneToOne: false;
            referencedRelation: "lineups";
            referencedColumns: ["id"];
          },
        ];
      };
      lineup_players: {
        Row: {
          is_captain: boolean;
          is_locked: boolean;
          is_vice: boolean;
          lineup_id: string;
          player_id: number;
          role: string;
        };
        Insert: {
          is_captain?: boolean;
          is_locked?: boolean;
          is_vice?: boolean;
          lineup_id: string;
          player_id: number;
          role: string;
        };
        Update: {
          is_captain?: boolean;
          is_locked?: boolean;
          is_vice?: boolean;
          lineup_id?: string;
          player_id?: number;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lineup_players_lineup_id_fkey";
            columns: ["lineup_id"];
            isOneToOne: false;
            referencedRelation: "lineups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lineup_players_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
        ];
      };
      lineups: {
        Row: {
          created_at: string | null;
          gameweek_id: number;
          id: string;
          is_active: boolean;
          name: string;
          total_cost: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          gameweek_id: number;
          id?: string;
          is_active?: boolean;
          name: string;
          total_cost: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          gameweek_id?: number;
          id?: string;
          is_active?: boolean;
          name?: string;
          total_cost?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lineups_gameweek_id_fkey";
            columns: ["gameweek_id"];
            isOneToOne: false;
            referencedRelation: "gameweeks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lineups_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      matches: {
        Row: {
          away_score: number | null;
          away_team_id: number;
          gameweek_id: number;
          home_score: number | null;
          home_team_id: number;
          id: number;
          match_date: string;
          reschedule_reason: string | null;
          status: string;
        };
        Insert: {
          away_score?: number | null;
          away_team_id: number;
          gameweek_id: number;
          home_score?: number | null;
          home_team_id: number;
          id?: number;
          match_date: string;
          reschedule_reason?: string | null;
          status?: string;
        };
        Update: {
          away_score?: number | null;
          away_team_id?: number;
          gameweek_id?: number;
          home_score?: number | null;
          home_team_id?: number;
          id?: number;
          match_date?: string;
          reschedule_reason?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey";
            columns: ["away_team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_gameweek_id_fkey";
            columns: ["gameweek_id"];
            isOneToOne: false;
            referencedRelation: "gameweeks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_home_team_id_fkey";
            columns: ["home_team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      player_stats: {
        Row: {
          assists: number;
          created_at: string | null;
          fantasy_points: number;
          gameweek_id: number;
          goals: number;
          health_status: string | null;
          id: number;
          in_team_of_week: boolean;
          lotto_assists: number;
          match_id: number | null;
          minutes_played: number;
          own_goals: number;
          penalties_caused: number;
          penalties_missed: number;
          penalties_saved: number;
          penalties_scored: number;
          penalties_won: number;
          player_id: number;
          predicted_start: boolean | null;
          price: number;
          red_cards: number;
          saves: number;
          updated_at: string | null;
          yellow_cards: number;
        };
        Insert: {
          assists: number;
          created_at?: string | null;
          fantasy_points: number;
          gameweek_id: number;
          goals: number;
          health_status?: string | null;
          id?: number;
          in_team_of_week?: boolean;
          lotto_assists?: number;
          match_id?: number | null;
          minutes_played: number;
          own_goals?: number;
          penalties_caused?: number;
          penalties_missed?: number;
          penalties_saved?: number;
          penalties_scored?: number;
          penalties_won?: number;
          player_id: number;
          predicted_start?: boolean | null;
          price: number;
          red_cards: number;
          saves?: number;
          updated_at?: string | null;
          yellow_cards: number;
        };
        Update: {
          assists?: number;
          created_at?: string | null;
          fantasy_points?: number;
          gameweek_id?: number;
          goals?: number;
          health_status?: string | null;
          id?: number;
          in_team_of_week?: boolean;
          lotto_assists?: number;
          match_id?: number | null;
          minutes_played?: number;
          own_goals?: number;
          penalties_caused?: number;
          penalties_missed?: number;
          penalties_saved?: number;
          penalties_scored?: number;
          penalties_won?: number;
          player_id?: number;
          predicted_start?: boolean | null;
          price?: number;
          red_cards?: number;
          saves?: number;
          updated_at?: string | null;
          yellow_cards?: number;
        };
        Relationships: [
          {
            foreignKeyName: "player_stats_gameweek_id_fkey";
            columns: ["gameweek_id"];
            isOneToOne: false;
            referencedRelation: "gameweeks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "player_stats_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "player_stats_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
        ];
      };
      players: {
        Row: {
          created_at: string | null;
          health_status: string;
          id: number;
          name: string;
          position: string;
          price: number;
          team_id: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          health_status: string;
          id?: number;
          name: string;
          position: string;
          price: number;
          team_id: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          health_status?: string;
          id?: number;
          name?: string;
          position?: string;
          price?: number;
          team_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      scrape_runs: {
        Row: {
          error_message: string | null;
          finished_at: string | null;
          gameweek_id: number | null;
          id: number;
          run_type: string;
          started_at: string;
          success: boolean;
        };
        Insert: {
          error_message?: string | null;
          finished_at?: string | null;
          gameweek_id?: number | null;
          id?: number;
          run_type: string;
          started_at: string;
          success: boolean;
        };
        Update: {
          error_message?: string | null;
          finished_at?: string | null;
          gameweek_id?: number | null;
          id?: number;
          run_type?: string;
          started_at?: string;
          success?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "scrape_runs_gameweek_id_fkey";
            columns: ["gameweek_id"];
            isOneToOne: false;
            referencedRelation: "gameweeks";
            referencedColumns: ["id"];
          },
        ];
      };
      teams: {
        Row: {
          crest_url: string | null;
          id: number;
          is_active: boolean;
          name: string;
          short_code: string;
        };
        Insert: {
          crest_url?: string | null;
          id?: number;
          is_active?: boolean;
          name: string;
          short_code: string;
        };
        Update: {
          crest_url?: string | null;
          id?: number;
          is_active?: boolean;
          name?: string;
          short_code?: string;
        };
        Relationships: [];
      };
      transfer_tips: {
        Row: {
          applied_at: string | null;
          created_at: string | null;
          gameweek_id: number;
          id: number;
          in_player_id: number;
          out_player_id: number;
          reason: string;
          status: string;
          user_id: string;
        };
        Insert: {
          applied_at?: string | null;
          created_at?: string | null;
          gameweek_id: number;
          id?: number;
          in_player_id: number;
          out_player_id: number;
          reason: string;
          status?: string;
          user_id: string;
        };
        Update: {
          applied_at?: string | null;
          created_at?: string | null;
          gameweek_id?: number;
          id?: number;
          in_player_id?: number;
          out_player_id?: number;
          reason?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transfer_tips_gameweek_id_fkey";
            columns: ["gameweek_id"];
            isOneToOne: false;
            referencedRelation: "gameweeks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transfer_tips_in_player_id_fkey";
            columns: ["in_player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transfer_tips_out_player_id_fkey";
            columns: ["out_player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transfer_tips_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tutorial_status: {
        Row: {
          last_step: number;
          skipped: boolean;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          last_step?: number;
          skipped?: boolean;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          last_step?: number;
          skipped?: boolean;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tutorial_status_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      gtrgm_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_options: {
        Args: { "": unknown };
        Returns: undefined;
      };
      gtrgm_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      set_limit: {
        Args: { "": number };
        Returns: number;
      };
      show_limit: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      show_trgm: {
        Args: { "": string };
        Returns: string[];
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
