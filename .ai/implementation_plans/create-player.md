# API Endpoint Implementation Plan: Create Player

## 1. Endpoint Overview

The Create Player endpoint allows administrators to add new players to the fantasy football system. This endpoint creates a new player record with team association, position, price, and health status. The endpoint requires admin-level authentication and validates all input data before insertion.

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/players`
- **Parameters**:
  - **Required**: 
    - `name` (string) - Player's full name
    - `team_id` (number) - ID of the team the player belongs to
    - `position` (string) - Player position (GK, DEF, MID, FWD)
    - `price` (number) - Player's market value
    - `health_status` (string) - Player's fitness status (Pewny, Wątpliwy, Nie zagra)
  - **Optional**: None
- **Request Body**: JSON object with all required fields
- **Headers**: Authorization: Bearer {token} (admin role required)

## 3. Used Types

### Command Models
```typescript
export interface CreatePlayerCommand {
  name: string;
  team_id: number;
  position: Position;
  price: number;
  health_status: HealthStatus;
}
```

### DTOs
```typescript
export interface PlayerDto {
  id: number;
  name: string;
  team: {
    id: number;
    name: string;
    short_code: string;
    crest_url: string | null;
  };
  position: Position;
  price: number;
  health_status: HealthStatus;
  created_at: string;
  message: string;
}
```

### Validation Schema
```typescript
export const createPlayerSchema = z.object({
  name: z.string().trim().min(1, "Player name is required").max(255, "Player name too long"),
  team_id: z.number().int().positive("Team ID must be positive"),
  position: z.enum(["GK", "DEF", "MID", "FWD"], {
    errorMap: () => ({ message: "Position must be GK, DEF, MID, or FWD" })
  }),
  price: z.number().positive("Price must be positive").max(50000000, "Price too high"),
  health_status: z.enum(["Pewny", "Wątpliwy", "Nie zagra"], {
    errorMap: () => ({ message: "Health status must be Pewny, Wątpliwy, or Nie zagra" })
  })
});
```

## 4. Response Details

### Success Response (201)
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
  "created_at": "2025-10-15T14:30:00Z",
  "message": "Player created successfully"
}
```

### Error Responses
- **400 Bad Request**: Validation errors, invalid input data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User lacks admin role
- **409 Conflict**: Player name already exists in the specified team
- **500 Internal Server Error**: Database or server errors

## 5. Data Flow

1. **Authentication**: Verify Bearer token and admin role
2. **Input Validation**: Validate request body against schema
3. **Team Validation**: Verify team_id exists in database
4. **Uniqueness Check**: Ensure player name doesn't exist in the same team
5. **Database Insert**: Create new player record in players table
6. **Response Construction**: Join with teams table to build response
7. **Return**: Send formatted response with created player data

## 6. Security Considerations

- **Authentication**: Require valid Bearer token
- **Authorization**: Verify admin role using Supabase RLS policies
- **Input Sanitization**: Validate and sanitize all input fields
- **SQL Injection**: Supabase client handles parameterized queries
- **Rate Limiting**: Consider implementing rate limits for admin endpoints
- **Data Validation**: Strict validation of enum values and data types
- **Uniqueness Constraints**: Prevent duplicate player names within teams

## 7. Error Handling

### Validation Errors (400)
- Missing required fields
- Invalid enum values for position or health_status
- Invalid data types
- Price out of reasonable range
- Team ID not found

### Authorization Errors (401/403)
- Missing authentication token
- Invalid or expired token
- User lacks admin privileges

### Conflict Errors (409)
- Player name already exists in the specified team

### Server Errors (500)
- Database connection issues
- Unexpected server errors
- Service unavailability

## 8. Performance Considerations

- **Single Database Operation**: One INSERT query for player creation
- **Minimal Joins**: Only join with teams table for response
- **Index Usage**: Leverage existing indexes on team_id foreign key
- **Response Size**: Keep response payload minimal
- **Caching**: No caching needed for write operations
- **Connection Pooling**: Supabase handles connection management

## 9. Implementation Steps

1. **Create Validation Schema**
   - Define Zod schema for request validation
   - Add custom error messages for better UX

2. **Implement Player Service**
   - Create `playerService.ts` in `src/lib/services/`
   - Add `createPlayer` method with validation and database operations
   - Include team existence and uniqueness checks

3. **Create API Endpoint**
   - Create `src/pages/api/players.ts`
   - Implement POST handler with authentication
   - Add request validation and error handling

4. **Add Type Definitions**
   - Update `src/types.ts` with CreatePlayerCommand and response types
   - Ensure proper TypeScript support

5. **Database Operations**
   - Use Supabase client for player insertion
   - Join with teams table for response data
   - Handle database errors gracefully

6. **Error Handling**
   - Implement comprehensive error responses
   - Add proper HTTP status codes
   - Include detailed error messages for debugging

7. **Testing**
   - Test with valid admin credentials
   - Test validation with invalid data
   - Test conflict scenarios
   - Test authorization edge cases

8. **Documentation**
   - Update API documentation
   - Add example requests and responses
   - Document error scenarios

## 10. Database Schema Requirements

The endpoint requires the following database structure:
- `players` table with columns: id, name, team_id, position, price, health_status, created_at
- `teams` table with columns: id, name, short_code, crest_url
- Foreign key constraint: players.team_id → teams.id
- Check constraints for position and health_status enums
- Unique constraint on (name, team_id) to prevent duplicates

## 11. Dependencies

- Supabase client for database operations
- Zod for request validation
- TypeScript for type safety
- Astro API routes for endpoint handling
- Authentication middleware for admin verification
