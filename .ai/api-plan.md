# REST API Plan - Fantasy Ekstraklasa Optimizer

## 1. Resources

### Core Resources
- **players** → players table (player information and current stats)
- **teams** → teams table (team information)
- **gameweeks** → gameweeks table (matchweek information)
- **matches** → matches table (match fixtures and results)
- **player-stats** → player_stats table (historical performance data)
- **lineups** → lineups table (user squads)
- **transfer-tips** → transfer_tips table (AI transfer recommendations)
- **bonuses** → bonuses table (available bonus types)

### User-Specific Resources
- **users** → users table (user profiles)
- **tutorial** → tutorial_status table (onboarding progress)
- **analytics** → generation_logs table (performance metrics)

### Admin Resources
- **admin/data** → scrape_runs table (data management)
- **admin/system** → system monitoring and health

## 2. Endpoints

### 2.1 Authentication

#### Register User
- **Method**: POST
- **Path**: `/api/auth/register`
- **Description**: Create new user account
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "gdpr_consent": true
}
```
- **Response (201)**:
```json
{
  "message": "Registration successful. Check email for verification.",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```
- **Errors**: 400 (validation), 409 (email exists)

#### Login User
- **Method**: POST
- **Path**: `/api/auth/login`
- **Description**: Authenticate user
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "remember_me": true
}
```
- **Response (200)**:
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```
- **Errors**: 401 (invalid credentials), 403 (unverified email)

#### Password Reset
- **Method**: POST
- **Path**: `/api/auth/reset-password`
- **Description**: Request password reset
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```
- **Response (200)**:
```json
{
  "message": "Reset link sent if email exists"
}
```

#### Logout User
- **Method**: POST
- **Path**: `/api/auth/logout`
- **Description**: End user session
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "message": "Logout successful"
}
```

### 2.2 Players

#### Get All Players
- **Method**: GET
- **Path**: `/api/players`
- **Description**: Retrieve players with statistics and filtering
- **Query Parameters**:
  - `position`: GK,DEF,MID,FWD (multi-select)
  - `team`: team_id (multi-select)
  - `price_min`: number (0-5000000)
  - `price_max`: number (0-5000000)
  - `health`: Pewny,Wątpliwy,Nie zagra (multi-select)
  - `form_min`: number (0-10)
  - `form_max`: number (0-10)
  - `search`: string (player name)
  - `sort`: name,price,fantasy_points,form (default: name)
  - `order`: asc,desc (default: asc)
  - `page`: number (default: 1)
  - `limit`: number (default: 50, max: 100)
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "players": [
    {
      "id": 1,
      "name": "Jan Kowalski",
      "team": {
        "id": 1,
        "name": "Legia Warszawa",
        "short_code": "LEG",
        "crest_url": "https://example.com/crest.png"
      },
      "position": "FWD",
      "price": 3500000,
      "health_status": "Pewny",
      "current_stats": {
        "fantasy_points": 125,
        "form": 8.5,
        "minutes_played": 1260,
        "goals": 12,
        "assists": 5,
        "yellow_cards": 3,
        "red_cards": 0,
        "predicted_start": true
      },
      "upcoming_matches": [
        {
          "opponent": "Cracovia",
          "home_away": "H",
          "difficulty": "easy",
          "date": "2025-10-15T15:30:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 487,
    "pages": 10
  },
  "filters_applied": {
    "position": ["FWD"],
    "price_max": 4000000
  }
}
```
- **Errors**: 400 (invalid parameters), 401 (unauthorized)

#### Get Player Details
- **Method**: GET
- **Path**: `/api/players/{id}`
- **Description**: Get detailed player information
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "id": 1,
  "name": "Jan Kowalski",
  "team": {
    "id": 1,
    "name": "Legia Warszawa",
    "short_code": "LEG",
    "crest_url": "https://example.com/crest.png"
  },
  "position": "FWD",
  "price": 3500000,
  "health_status": "Pewny",
  "current_stats": {
    "fantasy_points": 125,
    "form": 8.5,
    "minutes_played": 1260,
    "goals": 12,
    "assists": 5,
    "yellow_cards": 3,
    "red_cards": 0,
    "predicted_start": true
  },
  "recent_performances": [
    {
      "gameweek": 14,
      "opponent": "Cracovia",
      "minutes": 90,
      "fantasy_points": 8,
      "goals": 1,
      "assists": 0
    }
  ],
  "upcoming_matches": [
    {
      "opponent": "Wisła Kraków",
      "home_away": "A",
      "difficulty": "medium",
      "date": "2025-10-22T17:00:00Z"
    }
  ]
}
```
- **Errors**: 404 (player not found), 401 (unauthorized)

#### Compare Players
- **Method**: POST
- **Path**: `/api/players/compare`
- **Description**: Compare multiple players side-by-side
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "player_ids": [1, 15, 23]
}
```
- **Response (200)**:
```json
{
  "comparison": [
    {
      "id": 1,
      "name": "Jan Kowalski",
      "team": "Legia Warszawa",
      "position": "FWD",
      "price": 3500000,
      "stats": {
        "fantasy_points": 125,
        "form": 8.5,
        "goals": 12
      },
      "rankings": {
        "fantasy_points": 1,
        "form": 2,
        "price": 3
      }
    }
  ],
  "best_in_category": {
    "fantasy_points": 1,
    "form": 15,
    "price_efficiency": 23
  }
}
```
- **Errors**: 400 (invalid player IDs), 401 (unauthorized)

### 2.3 Teams

#### Get All Teams
- **Method**: GET
- **Path**: `/api/teams`
- **Description**: Get all teams with current form and fixtures
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "teams": [
    {
      "id": 1,
      "name": "Legia Warszawa",
      "short_code": "LEG",
      "crest_url": "https://example.com/crest.png",
      "league_position": 3,
      "recent_form": ["W", "W", "D"],
      "upcoming_matches": [
        {
          "opponent": "Cracovia",
          "home_away": "H",
          "difficulty": "easy",
          "date": "2025-10-15T15:30:00Z"
        }
      ],
      "player_count": 25,
      "avg_fantasy_points": 6.8
    }
  ]
}
```
- **Errors**: 401 (unauthorized)

#### Get Team Details
- **Method**: GET
- **Path**: `/api/teams/{id}`
- **Description**: Get detailed team information including all players
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "id": 1,
  "name": "Legia Warszawa",
  "short_code": "LEG",
  "crest_url": "https://example.com/crest.png",
  "league_position": 3,
  "full_fixtures": [
    {
      "date": "2025-10-15T15:30:00Z",
      "opponent": "Cracovia",
      "home_away": "H",
      "status": "scheduled"
    }
  ],
  "players": [
    {
      "id": 1,
      "name": "Jan Kowalski",
      "position": "FWD",
      "price": 3500000,
      "fantasy_points": 125
    }
  ],
  "stats": {
    "goals_for": 28,
    "goals_against": 15,
    "clean_sheets": 8
  }
}
```
- **Errors**: 404 (team not found), 401 (unauthorized)

### 2.4 Gameweeks and Matches

#### Get Current Gameweek
- **Method**: GET
- **Path**: `/api/gameweeks/current`
- **Description**: Get current active gameweek
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "id": 15,
  "number": 15,
  "start_date": "2025-10-14",
  "end_date": "2025-10-16",
  "status": "active",
  "matches": [
    {
      "id": 142,
      "home_team": "Legia Warszawa",
      "away_team": "Cracovia",
      "match_date": "2025-10-15T15:30:00Z",
      "status": "scheduled"
    }
  ]
}
```
- **Errors**: 401 (unauthorized)

#### Get All Gameweeks
- **Method**: GET
- **Path**: `/api/gameweeks`
- **Description**: Get all gameweeks
- **Query Parameters**:
  - `status`: upcoming,active,completed
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "gameweeks": [
    {
      "id": 15,
      "number": 15,
      "start_date": "2025-10-14",
      "end_date": "2025-10-16",
      "status": "active",
      "match_count": 9
    }
  ]
}
```

### 2.5 Lineups

#### Generate Lineup with AI
- **Method**: POST
- **Path**: `/api/lineups/generate`
- **Description**: Generate optimized lineup using AI
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "formation": "1-4-4-2",
  "gameweek_id": 15,
  "locked_players": [1, 15, 23],
  "strategy": "balanced",
  "preferences": {
    "prioritize_form": true,
    "avoid_risky_players": false
  }
}
```
- **Response (200)**:
```json
{
  "id": "temp-generation-id",
  "formation": "1-4-4-2",
  "total_cost": 28500000,
  "remaining_budget": 1500000,
  "players": {
    "starting": [
      {
        "id": 1,
        "name": "Jan Kowalski",
        "position": "FWD",
        "role": "starting",
        "is_captain": true,
        "is_vice": false,
        "is_locked": true,
        "price": 3500000,
        "form": 8.5,
        "predicted_points": 8
      }
    ],
    "bench": [
      {
        "id": 45,
        "name": "Piotr Nowak",
        "position": "DEF",
        "role": "bench",
        "price": 1800000,
        "form": 5.2,
        "predicted_points": 3
      }
    ]
  },
  "captains": {
    "captain": {
      "id": 1,
      "name": "Jan Kowalski",
      "reasoning": "Highest form (8.5) with easy fixture"
    },
    "vice_captain": {
      "id": 15,
      "name": "Adam Żukowski",
      "reasoning": "Consistent performer, good backup option"
    }
  },
  "suggested_bonus": {
    "type": "kapitanów_2",
    "reasoning": "Two high-form players with favorable fixtures",
    "potential_points": 16
  },
  "joker_candidates": [
    {
      "id": 78,
      "name": "Michał Kowal",
      "price": 1900000,
      "form": 7.8,
      "reasoning": "Best form under 2M budget"
    }
  ],
  "generation_info": {
    "model": "claude-3.5-sonnet",
    "generation_time": 18,
    "strategy_weights": {
      "form": 40,
      "fantasy_points": 30,
      "budget_optimization": 20,
      "team_form": 10
    }
  }
}
```
- **Errors**: 400 (invalid parameters), 408 (timeout), 500 (AI error), 401 (unauthorized)

#### Save Lineup
- **Method**: POST
- **Path**: `/api/lineups`
- **Description**: Save generated or modified lineup
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "name": "Kolejka 15 - Mocna forma",
  "formation": "1-4-4-2",
  "gameweek_id": 15,
  "is_active": true,
  "total_cost": 28500000,
  "players": [
    {
      "player_id": 1,
      "role": "starting",
      "is_captain": true,
      "is_vice": false,
      "is_locked": false
    }
  ],
  "bonus": {
    "type": "kapitanów_2"
  }
}
```
- **Response (201)**:
```json
{
  "id": "uuid",
  "name": "Kolejka 15 - Mocna forma",
  "formation": "1-4-4-2",
  "gameweek_id": 15,
  "is_active": true,
  "total_cost": 28500000,
  "created_at": "2025-10-15T10:30:00Z",
  "players_count": 15,
  "status": "AI + Edited"
}
```
- **Errors**: 400 (validation error), 409 (lineup limit reached), 401 (unauthorized)

#### Get User Lineups
- **Method**: GET
- **Path**: `/api/lineups`
- **Description**: Get all saved lineups for current user
- **Query Parameters**:  
  - `gameweek_id`: number (filter by gameweek)
  - `active_only`: boolean (only active lineups)
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "lineups": [
    {
      "id": "uuid",
      "name": "Kolejka 15 - Mocna forma",
      "formation": "1-4-4-2",
      "gameweek_id": 15,
      "is_active": true,
      "total_cost": 28500000,
      "created_at": "2025-10-15T10:30:00Z",
      "updated_at": "2025-10-15T10:30:00Z",
      "players_count": 15,
      "status": "AI + Edited",
      "bonus_applied": "kapitanów_2"
    }
  ],
  "usage": {
    "saved": 2,
    "limit": 3
  }
}
```

#### Get Lineup Details
- **Method**: GET
- **Path**: `/api/lineups/{id}`
- **Description**: Get detailed lineup information
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "id": "uuid",
  "name": "Kolejka 15 - Mocna forma",
  "formation": "1-4-4-2",
  "gameweek_id": 15,
  "is_active": true,
  "total_cost": 28500000,
  "created_at": "2025-10-15T10:30:00Z",
  "players": {
    "starting": [
      {
        "id": 1,
        "name": "Jan Kowalski",
        "team": "Legia Warszawa",
        "position": "FWD",
        "role": "starting",
        "is_captain": true,
        "is_vice": false,
        "price": 3500000,
        "form": 8.5
      }
    ],
    "bench": [
      {
        "id": 45,
        "name": "Piotr Nowak",
        "team": "Cracovia",
        "position": "DEF",
        "role": "bench",
        "price": 1800000,
        "form": 5.2
      }
    ]
  },
  "bonus_applied": {
    "type": "kapitanów_2",
    "applied_at": "2025-10-15T10:30:00Z"
  },
  "predicted_points": 67
}
```
- **Errors**: 404 (lineup not found), 403 (not owner), 401 (unauthorized)

#### Update Lineup
- **Method**: PUT
- **Path**: `/api/lineups/{id}`
- **Description**: Update existing lineup
- **Headers**: Authorization: Bearer {token}
- **Request Body**: Same as Save Lineup
- **Response (200)**:
```json
{
  "id": "uuid",
  "name": "Updated lineup name",
  "updated_at": "2025-10-15T11:15:00Z",
  "message": "Lineup updated successfully"
}
```
- **Errors**: 404 (not found), 403 (not owner), 400 (validation), 401 (unauthorized)

#### Delete Lineup
- **Method**: DELETE
- **Path**: `/api/lineups/{id}`
- **Description**: Delete saved lineup
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "message": "Lineup deleted successfully"
}
```
- **Errors**: 404 (not found), 403 (not owner), 401 (unauthorized)

#### Copy Lineup
- **Method**: POST
- **Path**: `/api/lineups/{id}/copy`
- **Description**: Create a copy of existing lineup
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "name": "Copy of Kolejka 15"
}
```
- **Response (201)**:
```json
{
  "id": "new-uuid",
  "name": "Copy of Kolejka 15",
  "message": "Lineup copied successfully"
}
```
- **Errors**: 404 (not found), 409 (lineup limit), 401 (unauthorized)

#### Export Lineup to Text
- **Method**: GET
- **Path**: `/api/lineups/{id}/export`
- **Description**: Get lineup in text format for copying
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "text_format": "SKŁAD - Kolejka 15 - Mocna forma (1-4-4-2)\nPODSTAWOWI:\nGK: Jan Kowalski (Legia)\n...",
  "format": "plain_text"
}
```

### 2.6 Bonuses

#### Get Available Bonuses
- **Method**: GET
- **Path**: `/api/bonuses`
- **Description**: Get all bonus types and their descriptions
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "bonuses": [
    {
      "id": 1,
      "name": "ławka_punktuje",
      "display_name": "Ławka punktuje",
      "description": "Punkty zawodników rezerwowych liczą się dodatkowo"
    },
    {
      "id": 2,
      "name": "kapitanów_2",
      "display_name": "Kapitanów 2",
      "description": "2 zawodników punktuje podwójnie"
    },
    {
      "id": 3,
      "name": "joker",
      "display_name": "Joker",
      "description": "Najlepszy zawodnik ≤2.0M punktuje podwójnie"
    }
  ]
}
```

#### Get Bonus Status for User
- **Method**: GET
- **Path**: `/api/bonuses/status`
- **Description**: Check which bonuses are available for current user
- **Query Parameters**:
  - `gameweek_id`: number (check for specific gameweek)
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "bonuses": [
    {
      "id": 1,
      "name": "ławka_punktuje",
      "display_name": "Ławka punktuje",
      "status": "available"
    },
    {
      "id": 2,
      "name": "kapitanów_2",
      "display_name": "Kapitanów 2",
      "status": "used",
      "used_in_gameweek": 14
    }
  ],
  "ai_suggestion": {
    "bonus": "kapitanów_2",
    "reasoning": "High-form players with easy fixtures available"
  }
}
```

#### Preview Bonus Effect
- **Method**: POST
- **Path**: `/api/bonuses/preview`
- **Description**: Preview bonus effect on current or proposed lineup
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "bonus_type": "kapitanów_2",
  "lineup_id": "uuid",
  "alternative_captains": [1, 15]
}
```
- **Response (200)**:
```json
{
  "bonus_type": "kapitanów_2",
  "current_prediction": {
    "without_bonus": 55,
    "with_bonus": 71,
    "difference": 16
  },
  "selected_players": [
    {
      "id": 1,
      "name": "Jan Kowalski",
      "predicted_points": 8,
      "doubled_points": 16,
      "reasoning": "Form 8.5, easy fixture, 95% start probability"
    }
  ],
  "risk_assessment": "Low - both players likely to start"
}
```

### 2.7 Transfer Tips

#### Get Transfer Recommendations
- **Method**: GET
- **Path**: `/api/transfer-tips`
- **Description**: Get AI-generated transfer recommendations
- **Query Parameters**:
  - `gameweek_id`: number (recommendations for specific gameweek)
  - `limit`: number (max recommendations, default 5)
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "recommendations": [
    {
      "id": 1,
      "out_player": {
        "id": 25,
        "name": "Marek Słaby",
        "team": "Zagłębie",
        "position": "MID",
        "price": 2800000,
        "recent_form": [1, 2, 1],
        "reason": "Form spada (3 kolejki po 1-2 pkt), trudny terminarz"
      },
      "in_player": {
        "id": 67,
        "name": "Tomasz Mocny",
        "team": "Raków",
        "position": "MID",
        "price": 2900000,
        "recent_form": [8, 11, 6],
        "reason": "Wysoka forma (średnia 8.3), łatwy terminarz następne 3 kolejki"
      },
      "price_difference": 100000,
      "confidence": 85,
      "priority": "high"
    }
  ],
  "summary": {
    "total_recommendations": 3,
    "high_priority": 1,
    "medium_priority": 2
  }
}
```

#### Apply Transfer Tip
- **Method**: POST
- **Path**: `/api/transfer-tips/{id}/apply`
- **Description**: Apply transfer recommendation to active lineup
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "lineup_id": "uuid"
}
```
- **Response (200)**:
```json
{
  "message": "Transfer applied successfully",
  "updated_lineup": {
    "id": "uuid",
    "total_cost": 28600000,
    "changes": {
      "out": "Marek Słaby",
      "in": "Tomasz Mocny",
      "price_impact": "+100k"
    }
  }
}
```
- **Errors**: 400 (budget exceeded), 404 (tip not found), 401 (unauthorized)

#### Dismiss Transfer Tip
- **Method**: POST
- **Path**: `/api/transfer-tips/{id}/dismiss`
- **Description**: Mark transfer tip as not interested
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "message": "Transfer tip dismissed"
}
```

### 2.8 Analytics and History

#### Get User Performance Analytics
- **Method**: GET
- **Path**: `/api/analytics/performance`
- **Description**: Get user vs AI performance comparison
- **Query Parameters**:
  - `gameweeks`: number (last N gameweeks, default 10)
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "summary": {
    "ai_acceptance_rate": 75,
    "avg_ai_points": 58,
    "avg_user_points": 62,
    "difference": 4,
    "total_gameweeks": 15
  },
  "weekly_comparison": [
    {
      "gameweek": 14,
      "ai_points": 55,
      "user_points": 67,
      "difference": 12,
      "modifications_made": 2
    }
  ],
  "modification_stats": {
    "most_changed_position": "FWD",
    "best_modification": {
      "gameweek": 12,
      "points_gained": 15,
      "change": "Kowalski → Nowak"
    }
  },
  "ai_effectiveness": {
    "success_rate_50plus": 80,
    "avg_generation_time": 18,
    "model_performance": "Above target (75%)"
  }
}
```

#### Get Lineup History
- **Method**: GET
- **Path**: `/api/lineups/history`
- **Description**: Get historical lineups with results
- **Query Parameters**:
  - `limit`: number (default 10)
  - `status`: all,ai_only,modified (filter by modification status)
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "history": [
    {
      "gameweek": 14,
      "lineup": {
        "id": "uuid",
        "name": "Kolejka 14",
        "formation": "1-4-4-2",
        "status": "AI + Edited"
      },
      "results": {
        "total_points": 67,
        "bonus_used": "kapitanów_2",
        "bonus_points": 12
      },
      "ai_comparison": {
        "ai_points": 55,
        "user_points": 67,
        "difference": 12
      },
      "date": "2025-10-08T15:00:00Z"
    }
  ],
  "summary": {
    "total_gameweeks": 15,
    "avg_points": 62,
    "best_gameweek": {
      "gameweek": 12,
      "points": 89
    }
  }
}
```

### 2.9 Data Management

#### Get Data Status
- **Method**: GET
- **Path**: `/api/data/status`
- **Description**: Check data freshness and system status
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "last_update": "2025-10-15T06:00:00Z",
  "status": "fresh",
  "age_hours": 2,
  "completeness": 95,
  "next_scheduled_update": "2025-10-16T06:00:00Z",
  "manual_refresh_available": true,
  "last_manual_refresh": "2025-10-14T18:30:00Z"
}
```

#### Trigger Manual Data Refresh
- **Method**: POST
- **Path**: `/api/data/refresh`
- **Description**: Manually trigger data scraping (rate limited)
- **Headers**: Authorization: Bearer {token}
- **Response (202)**:
```json
{
  "message": "Data refresh initiated",
  "estimated_completion": "2025-10-15T12:35:00Z",
  "next_available_refresh": "2025-10-15T13:30:00Z"
}
```
- **Errors**: 429 (rate limit exceeded), 401 (unauthorized)

#### Download Excel Template
- **Method**: GET
- **Path**: `/api/data/template`
- **Description**: Download Excel template for manual data import
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
  - **Content-Type**: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  - **File**: fantasy_ekstraklasa_szablon_2025.xlsx
- **Response Headers**:
```
Content-Disposition: attachment; filename="fantasy_ekstraklasa_szablon_2025.xlsx"
Content-Length: [file_size]
```

#### Upload and Validate Excel File
- **Method**: POST
- **Path**: `/api/data/import/validate`
- **Description**: Upload Excel file and validate structure and data
- **Headers**: 
  - Authorization: Bearer {token}
  - Content-Type: multipart/form-data
- **Request Body** (form-data):
```
file: [Excel file] (required, max 5MB, .xlsx/.xls)
```
- **Response (200)**:
```json
{
  "validation_id": "validate-uuid",
  "status": "success",
  "data_preview": [
    {
      "name": "Jan Kowalski",
      "team": "Legia Warszawa",
      "position": "FWD",
      "price": 3500000,
      "fantasy_points": 125,
      "health_status": "Pewny"
    }
  ],
  "statistics": {
    "total_rows": 487,
    "valid_rows": 485,
    "warnings": 2,
    "errors": 0
  },
  "validation_results": {
    "warnings": [
      {
        "row": 5,
        "field": "health_status",
        "message": "Puste pole, ustawiono domyślnie 'Pewny'",
        "severity": "warning"
      }
    ],
    "errors": []
  },
  "can_import": true,
  "expires_at": "2025-10-15T13:30:00Z"
}
```
- **Response (400)** - Validation errors:
```json
{
  "status": "error",
  "statistics": {
    "total_rows": 487,
    "valid_rows": 450,
    "warnings": 15,
    "errors": 22
  },
  "validation_results": {
    "errors": [
      {
        "row": 3,
        "field": "price",
        "message": "Nieprawidłowa cena: oczekiwano liczby, otrzymano 'abc'",
        "severity": "error"
      },
      {
        "row": 8,
        "field": "team",
        "message": "Nieznana drużyna: 'FC Barcelona'",
        "severity": "error"
      }
    ],
    "warnings": [
      {
        "row": 12,
        "field": "fantasy_points",
        "message": "Bardzo wysoka wartość (500), sprawdź poprawność",
        "severity": "warning"
      }
    ]
  },
  "can_import": false
}
```
- **Errors**: 413 (file too large), 415 (unsupported format), 401 (unauthorized)

#### Execute Data Import
- **Method**: POST
- **Path**: `/api/data/import/execute`
- **Description**: Execute validated data import to database
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "validation_id": "validate-uuid",
  "overwrite_mode": "replace_existing",
  "gameweek_id": 15
}
```
- **Response (201)**:
```json
{
  "import_id": "import-uuid",
  "status": "completed",
  "results": {
    "players_imported": 485,
    "players_updated": 350,
    "players_created": 135,
    "warnings_count": 2,
    "skipped_count": 2
  },
  "import_summary": {
    "started_at": "2025-10-15T12:00:00Z",
    "completed_at": "2025-10-15T12:02:15Z",
    "duration_seconds": 135,
    "overwrite_mode": "replace_existing"
  },
  "message": "Import completed successfully"
}
```
- **Errors**: 400 (invalid validation_id), 410 (validation expired), 409 (import in progress), 401 (unauthorized)

#### Get Import Status
- **Method**: GET
- **Path**: `/api/data/import/{import_id}`
- **Description**: Check status of ongoing or completed import
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "import_id": "import-uuid",
  "status": "in_progress",
  "progress": {
    "processed": 350,
    "total": 485,
    "percentage": 72
  },
  "current_step": "Updating player statistics",
  "started_at": "2025-10-15T12:00:00Z",
  "estimated_completion": "2025-10-15T12:02:30Z"
}
```
- **Errors**: 404 (import not found), 401 (unauthorized)

#### Get Import History
- **Method**: GET
- **Path**: `/api/data/import/history`
- **Description**: Get user's import history
- **Query Parameters**:
  - `limit`: number (default 10, max 50)
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "imports": [
    {
      "import_id": "import-uuid",
      "status": "completed",
      "started_at": "2025-10-15T12:00:00Z",
      "completed_at": "2025-10-15T12:02:15Z",
      "results": {
        "players_imported": 485,
        "warnings_count": 2
      },
      "filename": "players_data_oct15.xlsx"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

### 2.10 User Management

#### Get User Profile
- **Method**: GET
- **Path**: `/api/users/profile`
- **Description**: Get current user profile and preferences
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "created_at": "2025-10-01T10:00:00Z",
  "preferences": {
    "default_formation": "1-4-4-2",
    "ai_strategy": "balanced"
  },
  "tutorial_status": {
    "completed": true,
    "last_step": 4,
    "skipped": false
  },
  "statistics": {
    "lineups_created": 15,
    "avg_points": 62,
    "total_gameweeks": 15
  }
}
```

#### Update User Preferences
- **Method**: PUT
- **Path**: `/api/users/profile`
- **Description**: Update user preferences
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "preferences": {
    "default_formation": "1-4-3-3",
    "ai_strategy": "aggressive"
  }
}
```
- **Response (200)**:
```json
{
  "message": "Preferences updated successfully"
}
```

#### Get/Update Tutorial Status
- **Method**: GET/PUT
- **Path**: `/api/users/tutorial`
- **Description**: Get or update tutorial completion status
- **Headers**: Authorization: Bearer {token}
- **Request Body (PUT)**:
```json
{
  "last_step": 3,
  "skipped": false
}
```
- **Response (200)**:
```json
{
  "last_step": 3,
  "completed": false,
  "skipped": false,
  "updated_at": "2025-10-15T12:00:00Z"
}
```

### 2.11 Admin Endpoints

#### Admin Dashboard Data
- **Method**: GET
- **Path**: `/api/admin/dashboard`
- **Description**: Get admin dashboard metrics
- **Headers**: Authorization: Bearer {token} (admin role required)
- **Response (200)**:
```json
{
  "data_quality": {
    "freshness": "2 hours ago",
    "completeness": 95,
    "scraping_success_rate": 98,
    "last_scrape_status": "success"
  },
  "users": {
    "total_registered": 156,
    "monthly_active": 89,
    "new_this_week": 12,
    "retention_rate": 67
  },
  "ai_performance": {
    "acceptance_rate": 78,
    "success_rate_50plus": 82,
    "avg_points": 59,
    "failure_rate": 2
  },
  "system": {
    "api_usage_today": 2341,
    "avg_response_time": 245,
    "error_rate": 0.8,
    "uptime": 99.9
  }
}
```
- **Errors**: 403 (not admin), 401 (unauthorized)

#### Force Data Scraping
- **Method**: POST
- **Path**: `/api/admin/scrape`
- **Description**: Force immediate data scraping
- **Headers**: Authorization: Bearer {token} (admin role required)
- **Request Body**:
```json
{
  "type": "manual",
  "gameweek_id": 15
}
```
- **Response (202)**:
```json
{
  "message": "Scraping initiated",
  "job_id": "scrape-uuid",
  "estimated_completion": "2025-10-15T12:35:00Z"
}
```

## 3. Authentication and Authorization

### 3.1 Authentication Mechanism
- **Method**: JWT (JSON Web Tokens) via Supabase Auth
- **Token Placement**: Authorization header with Bearer token
- **Session Management**: Access tokens (1 hour) + Refresh tokens (30 days)
- **Token Refresh**: Automatic refresh via Supabase client libraries

### 3.2 Authorization Levels
- **Public**: Registration, login, password reset
- **Authenticated**: All main application features
- **Admin**: Dashboard access, system management, force scraping

### 3.3 Row-Level Security (RLS)
- Enforced at database level via Supabase RLS policies
- Users can only access their own lineups, transfer tips, tutorial status
- Admin users have broader read access for analytics

### 3.4 Rate Limiting
- **Login attempts**: 5 per 15 minutes per IP
- **Data refresh**: 1 per hour per user
- **AI generation**: 10 per hour per user
- **General API**: 1000 requests per hour per user

## 4. Validation and Business Logic

### 4.1 Input Validation
- **Player positions**: Must be one of ['GK', 'DEF', 'MID', 'FWD']
- **Health status**: Must be one of ['Pewny', 'Wątpliwy', 'Nie zagra']
- **Match status**: Must be one of ['scheduled', 'postponed', 'cancelled', 'played']
- **Player roles**: Must be one of ['starting', 'bench']
- **Transfer status**: Must be one of ['pending', 'applied', 'rejected']
- **Scrape run types**: Must be one of ['daily_main', 'pre_gameweek', 'post_gameweek', 'manual']

### 4.2 Lineup Business Logic
- **Budget constraint**: Total cost ≤ 30,000,000 (30M)
- **Squad composition**: Exactly 15 players (11 starting + 4 bench)
- **Formation validation**: Starting players must match chosen formation
- **Team diversity**: Maximum 3 players from same team
- **Captain/Vice uniqueness**: Different players, both from starting XI
- **Lineup limit**: Maximum 3 saved lineups per user per gameweek

### 4.3 Bonus System Logic
- **Usage limit**: Each bonus can be used once per round (half-season)
- **Eligibility**: 
  - Ławka punktuje: Any lineup
  - Kapitanów 2: Must have 2 starting players
  - Joker: Must have eligible player (≤2.0M, not captain)
- **Application**: Bonuses applied at lineup save time, cannot be changed after

### 4.4 AI Generation Logic
- **Blocking factors**: Prioritize 'Pewny' health status, exclude 'Nie zagra'
- **Strategy weights**: Form (40%), Fantasy Points (30%), Budget optimization (20%), Team form (10%)
- **Timeout**: 30 seconds maximum generation time
- **Fallback**: Alternative AI models if primary fails
- **Logging**: All generation attempts logged for analysis

### 4.5 Data Integrity
- **Price validation**: Player prices must be positive numbers
- **Date validation**: Gameweek dates must be logical (start < end)
- **Relationship integrity**: All foreign keys must reference valid records
- **Duplicate prevention**: Unique constraints enforced (player per gameweek stats, lineup names per user)

### 4.6 Data Import Validation Rules
- **File format**: Only .xlsx, .xls files accepted (max 5MB)
- **Required columns**: name, team, position, price, fantasy_points, health_status
- **Data validation**:
  - Player names: Non-empty, max 100 characters
  - Team names: Must match existing teams in database
  - Position: Must be one of ['GK', 'DEF', 'MID', 'FWD']
  - Price: Positive number, max 5,000,000 (5M)
  - Fantasy points: Non-negative integer, max 500
  - Health status: Must be one of ['Pewny', 'Wątpliwy', 'Nie zagra']
- **Business rules**:
  - No duplicate players per gameweek
  - Player must belong to valid Ekstraklasa team
  - Historical data can only be imported for past gameweeks
- **Warning conditions**: High fantasy points (>100), unusual price changes (>50%)
- **Error severity**: Critical (blocks import), Warning (allows import with notice)

### 4.7 Error Handling
- **Graceful degradation**: Cache fallback when live data unavailable
- **User feedback**: Clear error messages with suggested actions
- **Retry logic**: Automatic retries for transient failures
- **Monitoring**: All errors logged and monitored via Sentry
