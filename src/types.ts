import type { Database } from "./db/database.types";

// Enums derived from DB string patterns/constraints
export type Position = "GK" | "DEF" | "MID" | "FWD"; // From players.position
export type HealthStatus = "Pewny" | "Wątpliwy" | "Nie zagra"; // From players.health_status
export type MatchStatus = "scheduled" | "postponed" | "cancelled" | "played"; // From matches.status
export type LineupRole = "starting" | "bench"; // From lineup_players.role
export type BonusType = "ławka_punktuje" | "kapitanów_2" | "joker"; // From bonuses.name patterns in API
export type Strategy = "balanced" | "aggressive" | "defensive"; // API-specific, not DB
export type Priority = "high" | "medium" | "low"; // API for transfers
export type HomeAway = "H" | "A"; // Computed for matches
export type Difficulty = "easy" | "medium" | "hard"; // Computed for fixtures
export type OverwriteMode = "replace_existing" | "update_only"; // For imports
export type ValidationSeverity = "warning" | "error";
export type ImportStatus = "completed" | "failed" | "in_progress";
export type ScrapeType = "daily_main" | "pre_gameweek" | "post_gameweek" | "manual"; // From scrape_runs.run_type
export type GenerationStatus = "AI" | "AI + Edited" | "Manual"; // Computed for lineups
export type TransferStatus = "pending" | "applied" | "rejected" | "dismissed"; // From transfer_tips.status
export type TutorialCompletion = boolean; // Computed from tutorial_status.last_step >= max_steps

// Utility types for common operations
export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}
export type FiltersApplied = Record<string, string[]>; // For player filters summary

// === Command Models (API Request Bodies) ===

// Auth Commands
export interface RegisterCommand {
  email: string;
  password: string;
  confirmPassword: string;
  gdprConsent: boolean;
  // No direct DB tie; for Supabase auth.signUp
}

export interface LoginCommand {
  email: string;
  password: string;
  rememberMe?: boolean;
  // For Supabase auth.signInWithPassword
}

export interface ResetPasswordCommand {
  email: string;
  // For Supabase auth.resetPasswordForEmail
}

export interface CopyLineupCommand {
  name?: string;
  // For duplicating lineups Row
}

export interface ComparePlayersCommand {
  player_ids: number[];
  // Validates against players.id existence
}

export interface GenerateLineupCommand {
  formation: string; // e.g., "1-4-4-2"
  gameweek_id: number; // References gameweeks.id
  locked_players?: number[]; // References players.id
  strategy?: Strategy;
  preferences?: {
    prioritize_form?: boolean;
    avoid_risky_players?: boolean;
  };
  // Triggers generation_logs insert; validates gameweek_id exists
}

export interface SaveLineupCommand {
  name: string;
  formation: string;
  gameweek_id: number; // References gameweeks.id
  is_active?: boolean;
  total_cost: number;
  players: LineupPlayerAssignment[]; // 15 total, validates budget/team limits
  bonus?: {
    type: BonusType;
  };
  // Inserts into lineups + lineup_players; derives from TablesInsert<"lineups"> & TablesInsert<"lineup_players">
}

export type LineupPlayerAssignment = Omit<Database["public"]["Tables"]["lineup_players"]["Insert"], "lineup_id">;
// player_id references players.id; role: LineupRole; enforces uniqueness/captain rules

export interface BonusPreviewCommand {
  bonus_type: BonusType;
  lineup_id?: string; // References lineups.id
  alternative_captains?: number[]; // For "kapitanów_2"
  // Validates bonus eligibility against lineup_bonuses
}

export interface ApplyTransferCommand {
  lineup_id?: string; // References lineups.id (active)
  // Updates lineup_players; ties to transfer_tips apply
}

export interface UpdatePreferencesCommand {
  preferences: Partial<UserProfileDto["preferences"]>;
  // Updates user metadata (not in DB, app-level)
}

export interface UpdateTutorialCommand {
  last_step?: number;
  skipped?: boolean;
  // For TablesUpdate<"tutorial_status">
}

export interface ImportCommand {
  validation_id: string;
  overwrite_mode: OverwriteMode;
  gameweek_id?: number; // For player_stats.gameweek_id
  // Triggers insert/update to players, player_stats; validates against DB schemas
}

export interface ForceScrapeCommand {
  type: ScrapeType;
  gameweek_id?: number; // Optional for targeted scrape
  // Inserts into scrape_runs
}

// === DTOs (API Response Bodies) ===

// Shared Base Types
export interface AuthUser {
  id: string; // From users.id or Supabase auth.uid
  email: string; // From Supabase auth.users.email
  // Intersection: Database["public"]["Tables"]["users"]["Row"]["id"] & auth metadata
}

// Auth Responses
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  // Supabase auth response shape
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
  session: Session;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

// Player DTOs
export interface PlayerCurrentStats {
  fantasy_points: number; // From player_stats.fantasy_points (latest)
  form: number; // Computed: avg fantasy_points over last 3-5 gameweeks from player_stats
  minutes_played: number; // From player_stats.minutes_played (season total)
  goals: number; // From player_stats.goals (season)
  assists: number; // From player_stats.assists
  yellow_cards: number; // From player_stats.yellow_cards
  red_cards: number; // From player_stats.red_cards
  predicted_start: boolean; // From player_stats.predicted_start (latest)
  // Derived by aggregating/joining player_stats on player_id, ordered by gameweek_id desc
}

export interface UpcomingMatch {
  opponent: string; // teams.name (away/home)
  home_away: HomeAway;
  difficulty: Difficulty; // Computed from team form/fixtures
  date: string; // matches.match_date
  // Joined: matches Row where gameweek_id = current, team_id = player.team_id or opponent
}

export interface PlayerPerformance {
  gameweek: number; // gameweeks.number
  opponent: string; // teams.name
  minutes: number; // player_stats.minutes_played
  fantasy_points: number; // player_stats.fantasy_points
  goals: number; // player_stats.goals
  assists: number; // player_stats.assists
  // From player_stats join gameweeks, matches for historical (limit 5-10 recent)
}

export type PlayerDto = Pick<
  Database["public"]["Tables"]["players"]["Row"],
  "id" | "name" | "position" | "price" | "health_status"
> & {
  team: Pick<Database["public"]["Tables"]["teams"]["Row"], "id" | "name" | "short_code" | "crest_url">;
  current_stats: PlayerCurrentStats;
  upcoming_matches?: UpcomingMatch[];
  recent_performances?: PlayerPerformance[];
  // Joins: players + teams on team_id; player_stats latest per player_id; matches upcoming via team_id
};

export interface PlayerSummary
  extends Pick<Database["public"]["Tables"]["players"]["Row"], "id" | "name" | "position" | "price"> {
  fantasy_points: number; // Latest from player_stats
  // Minimal projection for team players list
}

// Change ComparePlayer to type alias
export type ComparePlayer = Pick<PlayerDto, "id" | "name" | "team" | "position" | "price"> & {
  stats: Pick<PlayerCurrentStats, "fantasy_points" | "form" | "goals">;
  rankings: {
    fantasy_points: number; // Computed rank among compared
    form: number;
    price: number; // Efficiency rank
  };
  // Derived from multiple PlayerDto; rankings computed in API
};

export interface BestInCategory {
  fantasy_points: number; // Player id of best
  form: number;
  price_efficiency: number;
  // Computed max ranks from comparison set
}

export interface ComparePlayersResponse {
  comparison: ComparePlayer[];
  best_in_category: BestInCategory;
}

// Team DTOs
export interface TeamStats {
  goals_for: number; // Aggregate from matches (home_score where home_team_id = team.id)
  goals_against: number; // Aggregate from matches
  clean_sheets: number; // Count matches where opponent score = 0
  // Computed via SQL aggregates on matches join teams
}

export type TeamDto = Database["public"]["Tables"]["teams"]["Row"] & {
  league_position?: number; // External/computed
  recent_form?: string[]; // "W"|"D"|"L" from last 5 matches.status/results
  upcoming_matches?: UpcomingMatch[];
  player_count?: number; // Count players.team_id = team.id
  avg_fantasy_points?: number; // Avg player_stats.fantasy_points for team players
  // Base teams Row + computed from matches, players, player_stats joins
};

// Add/Change TeamDetailsDto to type
export type TeamDetailsDto = TeamDto & {
  full_fixtures: MatchSummary[]; // All matches where home_team_id or away_team_id = team.id, ordered by match_date
  players: PlayerSummary[]; // All players where team_id = team.id, sorted by position/price
  stats: TeamStats;
  // Extends TeamDto with deeper joins/aggregates
};

export interface MatchSummary
  extends Pick<Database["public"]["Tables"]["matches"]["Row"], "id" | "match_date" | "status"> {
  home_team: string; // teams.name where home_team_id
  away_team: string; // teams.name where away_team_id
  // Projection + join teams for names (avoid full team objects for perf)
}

// Gameweek DTOs
export type GameweekDto = Database["public"]["Tables"]["gameweeks"]["Row"] & {
  status: MatchStatus | "upcoming" | "active" | "completed"; // Extend DB with computed status
  match_count?: number; // Count matches.gameweek_id = id
  // Base + aggregate from matches
};

export type CurrentGameweekResponse = GameweekDto & {
  matches: MatchSummary[]; // All matches for this gameweek_id
};

// Lineup DTOs
// Change LineupPlayer to type alias
export type LineupPlayer = Pick<
  Database["public"]["Tables"]["lineup_players"]["Row"],
  "player_id" | "role" | "is_captain" | "is_vice" | "is_locked"
> & {
  id: number; // Alias player_id
  name: string; // players.name
  position: Position; // players.position
  team?: string; // teams.name (for detailed)
  price: number; // players.price
  form: number; // Computed from current_stats
  predicted_points: number; // AI-computed, not DB
  // Join: lineup_players + players on player_id + teams
};

export type DetailedLineupPlayer = LineupPlayer & {
  team: string; // teams.name
};

export interface LineupCaptain {
  id: number;
  name: string;
  reasoning: string; // AI explanation
}

export interface BonusSuggestion {
  type: BonusType;
  reasoning: string;
  potential_points: number; // Estimated bonus impact
  // Suggests from bonuses; reasoning computed
}

export type JokerCandidate = Pick<LineupPlayer, "id" | "name" | "price" | "form"> & {
  reasoning: string;
  // Subset for joker bonus candidates (<=2M filter)
};

export interface GenerationInfo
  extends Pick<Database["public"]["Tables"]["generation_logs"]["Row"], "model" | "generation_time"> {
  strategy_weights: {
    form: number;
    fantasy_points: number;
    budget_optimization: number;
    team_form: number;
  }; // API-specific weights
  // From generation_logs; weights hardcoded/computed in API
}

export interface GeneratedLineupDto {
  id: string; // Temp UUID
  formation: string;
  total_cost: number;
  remaining_budget: number; // 30M - total_cost
  players: {
    starting: LineupPlayer[]; // 11 players
    bench: LineupPlayer[]; // 4 players
  };
  captains: {
    captain: LineupCaptain;
    vice_captain: LineupCaptain;
  };
  suggested_bonus?: BonusSuggestion;
  joker_candidates?: JokerCandidate[];
  generation_info: GenerationInfo;
  // Temp before save; players from AI selection, joins as LineupPlayer
}

// In SavedLineupDto, add formation and adjust bonus_applied
export type SavedLineupDto = Database["public"]["Tables"]["lineups"]["Row"] & {
  formation: string; // App-level field, not in DB; from save command
  players_count: number; // Count lineup_players.lineup_id = id (always 15)
  status?: GenerationStatus; // Computed from generation_logs or manual flag
  bonus_applied?: BonusApplied; // bonuses.name or full object if lineup_bonuses.lineup_id = id
  // Base lineups Row + aggregates/joins
};

// Define BonusApplied union
export type BonusApplied = string | { type: BonusType; applied_at: string };

// Change LineupDetailsDto to type alias
export type LineupDetailsDto = SavedLineupDto & {
  players: {
    starting: DetailedLineupPlayer[];
    bench: DetailedLineupPlayer[];
  };
  bonus_applied?: BonusApplied;
  predicted_points?: number; // AI recompute on fetch
  // Joins: lineups + lineup_players + players + teams + bonuses via lineup_bonuses
};

export interface LineupsResponse {
  lineups: SavedLineupDto[];
  usage: {
    saved: number; // Count lineups.user_id = current, is_active or per gameweek
    limit: number; // Hardcoded 3 per gameweek
  };
}

export interface CopyLineupResponse {
  id: string; // New lineups.id
  name: string;
  message: string;
}

export interface ExportLineupResponse {
  text_format: string; // Formatted string for copy-paste
  format: "plain_text";
}

// Bonus DTOs
export type BonusDto = Database["public"]["Tables"]["bonuses"]["Row"] & {
  display_name: string; // Human-readable from name (API addition)
  // Base + computed display
};

export interface BonusesResponse {
  bonuses: BonusDto[];
}

export type BonusStatus = Pick<BonusDto, "id" | "name" | "display_name"> & {
  status: "available" | "used";
  used_in_gameweek?: number; // If used, from lineup_bonuses join gameweeks
  // Checks lineup_bonuses for user/gameweek usage
};

export interface BonusStatusesResponse {
  bonuses: BonusStatus[];
  ai_suggestion?: {
    bonus: BonusType;
    reasoning: string;
  };
}

export interface BonusSelectedPlayer {
  id: number;
  name: string;
  predicted_points: number;
  doubled_points: number; // 2 * predicted_points
  reasoning: string;
}

export interface BonusPreviewResponse {
  bonus_type: BonusType;
  current_prediction: {
    without_bonus: number;
    with_bonus: number;
    difference: number;
  };
  selected_players: BonusSelectedPlayer[];
  risk_assessment: string; // Computed risk based on health_status, predicted_start
}

// Transfer DTOs
export interface TransferPlayer extends Pick<PlayerDto, "id" | "name" | "team" | "position" | "price"> {
  recent_form: number[]; // Last 3 fantasy_points from player_stats
  reason: string; // AI reasoning
  // Subset PlayerDto + computed form history
}

export interface TransferRecommendation {
  id: number; // transfer_tips.id
  out_player: TransferPlayer; // out_player_id -> players
  in_player: TransferPlayer; // in_player_id -> players
  price_difference: number; // in.price - out.price
  confidence: number; // 0-100, AI score
  priority: Priority;
  // From transfer_tips Row + joins to players for out/in; reason from transfer_tips.reason
}

export interface TransferTipsResponse {
  recommendations: TransferRecommendation[];
  summary: {
    total_recommendations: number;
    high_priority: number;
    medium_priority: number;
  };
}

export interface ApplyTransferResponse {
  message: string;
  updated_lineup: {
    id: string; // lineups.id
    total_cost: number;
    changes: {
      out: string; // out_player.name
      in: string; // in_player.name
      price_impact: string; // e.g., "+100k"
    };
  };
  // After updating lineup_players
}

// Analytics DTOs
export interface WeeklyComparison {
  gameweek: number; // gameweeks.number
  ai_points: number; // From generation_logs for AI lineup
  user_points: number; // Actual from lineups + post-game player_stats
  difference: number;
  modifications_made: number; // Count changes from AI
  // Computed by joining lineups, generation_logs, player_stats for gameweek
}

export interface PerformanceAnalyticsResponse {
  summary: {
    ai_acceptance_rate: number; // % lineups saved without edits
    avg_ai_points: number;
    avg_user_points: number;
    difference: number;
    total_gameweeks: number;
  };
  weekly_comparison: WeeklyComparison[];
  modification_stats: {
    most_changed_position: Position;
    best_modification: {
      gameweek: number;
      points_gained: number;
      change: string; // e.g., "PlayerA -> PlayerB"
    };
  };
  ai_effectiveness: {
    success_rate_50plus: number; // % generations >50 points
    avg_generation_time: number; // From generation_logs
    model_performance: string; // e.g., "Above target"
  };
  // Aggregates from generation_logs join lineups, player_stats over user history
}

// In HistoryLineup, now formation is in SavedLineupDto
export interface HistoryLineup {
  gameweek: number;
  lineup: Pick<SavedLineupDto, "id" | "name" | "formation"> & { status: GenerationStatus };
  results: {
    total_points: number; // Sum player_stats.fantasy_points * multipliers (captain, bonus)
    bonus_used: BonusType;
    bonus_points: number;
  };
  ai_comparison: Pick<WeeklyComparison, "ai_points" | "user_points" | "difference">;
  date: string; // lineups.created_at
  // Post-game computation: lineups + lineup_players + player_stats (for gameweek) + bonuses
}

export interface HistoryResponse {
  history: HistoryLineup[];
  summary: {
    total_gameweeks: number;
    avg_points: number;
    best_gameweek: {
      gameweek: number;
      points: number;
    };
  };
}

// Data Management DTOs
export interface DataStatusResponse {
  last_update: string; // scrape_runs.finished_at (latest success)
  status: "fresh" | "stale"; // If age_hours > 24
  age_hours: number; // Computed from now - last_update
  completeness: number; // % players with stats for current gameweek
  next_scheduled_update: string; // Cron-based
  manual_refresh_available: boolean; // If last manual >1h ago
  last_manual_refresh?: string; // Latest scrape_runs where run_type="manual"
  // Derived from latest scrape_runs Row
}

export interface RefreshResponse {
  message: string;
  estimated_completion: string;
  next_available_refresh: string;
  // After inserting scrape_runs
}

export interface ValidationIssue {
  row: number;
  field: string;
  message: string;
  severity: ValidationSeverity;
  // For Excel validation against players schema
}

// In ValidationResponse, use ImportPlayerRow
export interface ValidationResponse {
  validation_id: string;
  status: "success" | "error";
  data_preview: ImportPlayerRow[]; // First 5 rows, custom shape for import
  statistics: {
    total_rows: number;
    valid_rows: number;
    warnings: number;
    errors: number;
  };
  validation_results: {
    warnings: ValidationIssue[];
    errors: ValidationIssue[];
  };
  can_import: boolean;
  expires_at: string; // validation timeout
  // Temp structure for Excel parse; maps to players + player_stats Insert
}

// Change ImportResult to type alias
export type ImportResult = Omit<ValidationResponse, "data_preview" | "validation_results"> & {
  results: {
    players_imported: number; // New inserts to players/player_stats
    players_updated: number; // Updates to existing
    players_created: number;
    warnings_count: number;
    skipped_count: number; // Invalid rows
  };
  import_summary: {
    started_at: string;
    completed_at?: string;
    duration_seconds?: number;
    overwrite_mode: OverwriteMode;
  };
  message?: string;
  // After DB inserts/updates; logs to scrape_runs or new import_logs
};

export interface ImportStatusResponse {
  import_id: string;
  status: ImportStatus;
  progress?: {
    processed: number;
    total: number;
    percentage: number;
  };
  current_step?: string; // e.g., "Inserting players"
  started_at: string;
  estimated_completion?: string;
  // Polling for async import from ImportResult
}

export interface ImportHistoryItem {
  import_id: string;
  status: ImportStatus;
  started_at: string;
  completed_at?: string;
  results?: Pick<ImportResult["results"], "players_imported" | "warnings_count">;
  filename: string; // Uploaded file name
  // From historical scrape_runs or import_logs where run_type="manual_import"
}

export interface ImportHistoryResponse {
  imports: ImportHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// User DTOs
export type UserProfileDto = Database["public"]["Tables"]["users"]["Row"] & {
  email: string; // Supabase auth
  preferences: {
    default_formation: string; // App-level, not DB
    ai_strategy: Strategy;
  };
  tutorial_status: TutorialStatus;
  statistics: {
    lineups_created: number; // Count lineups.user_id = id
    avg_points: number; // Avg from history
    total_gameweeks: number;
  };
  // Base users + joins to tutorial_status, aggregates from lineups/generation_logs
};

export type TutorialStatus = Database["public"]["Tables"]["tutorial_status"]["Row"] & {
  completed: TutorialCompletion; // last_step >= 4 (API max steps)
  // Base + computed completed
};

// Admin DTOs
export interface AdminDashboardResponse {
  data_quality: {
    freshness: string; // Age from DataStatus
    completeness: number; // As above
    scraping_success_rate: number; // % success in recent scrape_runs
    last_scrape_status: "success" | "failed"; // Latest scrape_runs.success
  };
  users: {
    total_registered: number; // Count users
    monthly_active: number; // Count distinct users in last 30d from lineups/generation_logs
    new_this_week: number; // Count users.created_at recent
    retention_rate: number; // Computed %
  };
  ai_performance: {
    acceptance_rate: number; // % saved lineups from generation_logs
    success_rate_50plus: number;
    avg_points: number; // Avg actual points for AI lineups
    failure_rate: number; // % generation_logs.success = false
  };
  system: {
    api_usage_today: number; // Count requests (app logs)
    avg_response_time: number;
    error_rate: number;
    uptime: number;
  };
  // Aggregates: Counts/avgs from users, scrape_runs, generation_logs, lineups
}

export interface ScrapeResponse {
  message: string;
  job_id: string; // scrape_runs.id
  estimated_completion: string;
  // After admin scrape insert
}

// Re-exports for Entities (direct DB for internal use)
export type { Tables, TablesInsert, TablesUpdate, Enums } from "./db/database.types";

// Example usage: type PlayerEntity = Tables<"players">; // For internal DB ops

// Define ImportPlayerRow for preview
export interface ImportPlayerRow {
  name: string;
  team: string; // String name, validated against teams.name
  position: Position;
  price: number;
  health_status: HealthStatus;
  fantasy_points: number; // From import sheet, for player_stats
}
