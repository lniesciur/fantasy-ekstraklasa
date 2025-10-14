/**
 * Gameweeks Seeding Script
 * 
 * This script populates the gameweeks table with data for the 2024-2025 Ekstraklasa season.
 * Run with: node scripts/seed-gameweeks.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Gameweeks data for 2024-2025 Ekstraklasa season
const gameweeksData = [
  { number: 1, start_date: '2024-07-19', end_date: '2024-07-22' },
  { number: 2, start_date: '2024-07-26', end_date: '2024-07-29' },
  { number: 3, start_date: '2024-08-02', end_date: '2024-08-05' },
  { number: 4, start_date: '2024-08-09', end_date: '2024-08-12' },
  { number: 5, start_date: '2024-08-16', end_date: '2024-08-19' },
  { number: 6, start_date: '2024-08-23', end_date: '2024-08-26' },
  { number: 7, start_date: '2024-08-30', end_date: '2024-09-02' },
  { number: 8, start_date: '2024-09-13', end_date: '2024-09-16' },
  { number: 9, start_date: '2024-09-20', end_date: '2024-09-23' },
  { number: 10, start_date: '2024-09-27', end_date: '2024-09-30' },
  { number: 11, start_date: '2024-10-04', end_date: '2024-10-07' },
  { number: 12, start_date: '2024-10-18', end_date: '2024-10-21' },
  { number: 13, start_date: '2024-10-25', end_date: '2024-10-28' },
  { number: 14, start_date: '2024-11-01', end_date: '2024-11-04' },
  { number: 15, start_date: '2024-11-08', end_date: '2024-11-11' },
  { number: 16, start_date: '2024-11-22', end_date: '2024-11-25' },
  { number: 17, start_date: '2024-11-29', end_date: '2024-12-02' },
  { number: 18, start_date: '2024-12-06', end_date: '2024-12-09' },
  { number: 19, start_date: '2024-12-13', end_date: '2024-12-16' },
  { number: 20, start_date: '2024-12-20', end_date: '2024-12-23' },
  { number: 21, start_date: '2025-01-31', end_date: '2025-02-03' },
  { number: 22, start_date: '2025-02-07', end_date: '2025-02-10' },
  { number: 23, start_date: '2025-02-14', end_date: '2025-02-17' },
  { number: 24, start_date: '2025-02-21', end_date: '2025-02-24' },
  { number: 25, start_date: '2025-02-28', end_date: '2025-03-03' },
  { number: 26, start_date: '2025-03-07', end_date: '2025-03-10' },
  { number: 27, start_date: '2025-03-14', end_date: '2025-03-17' },
  { number: 28, start_date: '2025-03-21', end_date: '2025-03-24' },
  { number: 29, start_date: '2025-04-04', end_date: '2025-04-07' },
  { number: 30, start_date: '2025-04-11', end_date: '2025-04-14' },
  { number: 31, start_date: '2025-04-18', end_date: '2025-04-21' },
  { number: 32, start_date: '2025-04-25', end_date: '2025-04-28' },
  { number: 33, start_date: '2025-05-02', end_date: '2025-05-05' },
  { number: 34, start_date: '2025-05-09', end_date: '2025-05-12' },
  { number: 35, start_date: '2025-05-16', end_date: '2025-05-19' },
  { number: 36, start_date: '2025-05-23', end_date: '2025-05-26' },
  { number: 37, start_date: '2025-05-30', end_date: '2025-06-02' },
  { number: 38, start_date: '2025-06-06', end_date: '2025-06-09' }
];

async function seedGameweeks() {
  try {
    console.log('🌱 Starting gameweeks seeding...');
    
    // Check if gameweeks already exist
    const { data: existingGameweeks, error: checkError } = await supabase
      .from('gameweeks')
      .select('number')
      .limit(1);
    
    if (checkError) {
      throw new Error(`Failed to check existing gameweeks: ${checkError.message}`);
    }
    
    if (existingGameweeks && existingGameweeks.length > 0) {
      console.log('⚠️  Gameweeks already exist. Skipping seeding.');
      return;
    }
    
    // Insert all gameweeks
    const { data, error } = await supabase
      .from('gameweeks')
      .insert(gameweeksData)
      .select();
    
    if (error) {
      throw new Error(`Failed to insert gameweeks: ${error.message}`);
    }
    
    console.log(`✅ Successfully seeded ${data.length} gameweeks`);
    console.log('📅 Season: 2024-2025 Ekstraklasa');
    console.log(`📊 Gameweeks: 1-${data.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding gameweeks:', error.message);
    process.exit(1);
  }
}

// Run the seeding
seedGameweeks();
