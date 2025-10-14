# API Endpoint Implementation Plan: Create Match

## 1. Endpoint Overview

The Create Match endpoint allows administrators to create new matches in the Fantasy Ekstraklasa system. This endpoint is restricted to admin users only and creates a new match record with associated gameweek and team information. The endpoint validates all input data, ensures referential integrity, and prevents duplicate matches.

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/matches`
- **Parameters**:
  - **Required**: 
    - `gameweek_id` (number) - References gameweeks.id
    - `home_team_id` (number) - References teams.id
    - `away_team_id` (number) - References teams.id
    - `match_date` (string) - ISO 8601 timestamp
    - `status` (string) - One of: 'scheduled', 'postponed', 'cancelled', 'played'
- **Optional**: None
- **Request Body**: JSON object with all required fields

## 3. Used Types

### Command Models
```typescript
export interface CreateMatchCommand {
  gameweek_id: number;
  home_team_id: number;
  away_team_id: number;
  match_date: string; // ISO 8601 format
  status: MatchStatus; // 'scheduled' | 'postponed' | 'cancelled' | 'played'
}
```

### Response DTOs
```typescript
export interface CreateMatchResponse {
  id: number;
  gameweek_id: number;
  home_team: {
    id: number;
    name: string;
    short_code: string;
  };
  away_team: {
    id: number;
    name: string;
    short_code: string;
  };
  match_date: string;
  status: MatchStatus;
  created_at: string;
  message: string;
}
```

### Database Types
- `TablesInsert<"matches">` from database.types.ts
- `Tables<"gameweeks">` for validation
- `Tables<"teams">` for validation

## 4. Response Details

- **Success (201)**: Returns created match with team details and success message
- **Error Responses**:
  - **400**: Invalid input data, validation errors
  - **401**: Unauthorized (no authentication token)
  - **403**: Forbidden (user not admin)
  - **404**: Gameweek or team not found
  - **409**: Duplicate match exists
  - **500**: Server/database errors

## 5. Data Flow

1. **Authentication**: Verify Bearer token and admin role
2. **Input Validation**: Validate request body against schema
3. **Referential Integrity**: Check gameweek_id and team_ids exist
4. **Business Logic Validation**: Ensure home_team_id ≠ away_team_id
5. **Duplicate Check**: Verify no duplicate match exists
6. **Database Insert**: Create new match record
7. **Response Assembly**: Fetch team details and format response
8. **Error Handling**: Log errors and return appropriate status codes

## 6. Security Considerations

- **Authentication**: Bearer token required in Authorization header
- **Authorization**: Admin role verification via Supabase RLS
- **Input Validation**: Comprehensive validation of all input fields
- **SQL Injection**: Prevented by Supabase parameterized queries
- **Rate Limiting**: Consider implementing for admin endpoints
- **Data Sanitization**: Validate and sanitize all input data

## 7. Error Handling

### Validation Errors (400)
- Invalid gameweek_id format
- Invalid team_id format
- Invalid match_date format
- Invalid status value
- Missing required fields

### Authorization Errors (401/403)
- No authentication token provided
- Invalid or expired token
- User lacks admin role

### Not Found Errors (404)
- Gameweek with specified ID doesn't exist
- Team with specified ID doesn't exist

### Conflict Errors (409)
- Duplicate match (same teams in same gameweek)
- Match already exists for the same teams and gameweek

### Server Errors (500)
- Database connection issues
- Unexpected server errors
- Service unavailability

## 8. Performance Considerations

- **Database Indexes**: Leverage existing indexes on foreign keys
- **Validation Queries**: Use efficient single queries for existence checks
- **Response Size**: Minimal response payload
- **Caching**: Not applicable for creation operations
- **Connection Pooling**: Supabase handles connection management

## 9. Implementation Steps

1. **Create Command Model**: Add `CreateMatchCommand` interface to `src/types.ts`
2. **Create Response DTO**: Add `CreateMatchResponse` interface to `src/types.ts`
3. **Create Validation Schema**: Add Zod schema for request validation
4. **Create Match Service**: Implement `src/lib/services/matchService.ts` with:
   - `createMatch()` method
   - Validation logic
   - Database operations
   - Error handling
5. **Create API Endpoint**: Implement `src/pages/api/matches.ts` with:
   - Authentication middleware
   - Request validation
   - Service call
   - Response formatting
6. **Add Error Handling**: Implement comprehensive error handling and logging
7. **Add Tests**: Create unit tests for service and integration tests for endpoint
8. **Update Documentation**: Update API documentation with new endpoint

## 10. Database Operations

### Required Queries
```sql
-- Check gameweek exists
SELECT id FROM gameweeks WHERE id = $1;

-- Check teams exist
SELECT id, name, short_code FROM teams WHERE id IN ($1, $2);

-- Check for duplicate match
SELECT id FROM matches 
WHERE gameweek_id = $1 
AND ((home_team_id = $2 AND away_team_id = $3) 
OR (home_team_id = $3 AND away_team_id = $2));

-- Insert new match
INSERT INTO matches (gameweek_id, home_team_id, away_team_id, match_date, status)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
```

### Transaction Requirements
- Wrap validation and insertion in a single transaction
- Rollback on any validation failure
- Ensure atomicity of the entire operation

## 11. Service Implementation Structure

```typescript
// src/lib/services/matchService.ts
export class MatchService {
  async createMatch(command: CreateMatchCommand): Promise<CreateMatchResponse> {
    // 1. Validate gameweek exists
    // 2. Validate teams exist
    // 3. Check for duplicates
    // 4. Validate business rules
    // 5. Insert match
    // 6. Return formatted response
  }
  
  private async validateGameweek(gameweekId: number): Promise<void>
  private async validateTeams(teamIds: number[]): Promise<Team[]>
  private async checkDuplicateMatch(command: CreateMatchCommand): Promise<void>
  private formatMatchResponse(match: Tables<"matches">, teams: Team[]): CreateMatchResponse
}
```

## 12. Testing Strategy

### Unit Tests
- Service method validation
- Error handling scenarios
- Response formatting

### Integration Tests
- End-to-end API testing
- Authentication and authorization
- Database operations
- Error response formats

### Test Cases
- Valid match creation
- Invalid input validation
- Authorization failures
- Duplicate match prevention
- Database error handling
