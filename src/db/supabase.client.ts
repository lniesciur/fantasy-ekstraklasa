import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types.ts";

// Use environment variables or fall back to local development defaults
const supabaseUrl = import.meta.env.SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseAnonKey = import.meta.env.SUPABASE_KEY || "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file and ensure SUPABASE_URL and SUPABASE_KEY are set."
  );
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
export type SupabaseClient = typeof supabaseClient;

export const DEFAULT_USER_ID = "3eca5d9c-c853-483c-b110-59b0f53e3676";
