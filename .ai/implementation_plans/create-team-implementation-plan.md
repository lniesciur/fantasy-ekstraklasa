# API Endpoint Implementation Plan: Create Team

## 1. Endpoint Overview

This endpoint creates a new team in the Fantasy Ekstraklasa system. It requires admin-level authentication and validates team data before insertion. The endpoint follows RESTful conventions and enforces database constraints, particularly ensuring team name and short_code uniqueness.

**Key Requirements:**
- Admin-only access with bearer token authentication
- Validation of required fields (name, short_code)
- Uniqueness checks for team name and short_code
- Optional fields support (crest_url, is_active)
- Proper error handling and status codes

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/teams`
- **Headers**: 
  - `Authorization: Bearer {token}` (required)
  - `Content-Type: application/json` (required)

### Parameters:
- **Required**:
  - `name` (string): Team name, must be unique
  - `short_code` (string): Team abbreviation, max 10 chars, must be unique
- **Optional**:
  - `crest_url` (string): URL to team logo/crest image
  - `is_active` (boolean): Team active status, defaults to true

### Request Body Schema:
```json
{
  "name": "string (required, 1-255 chars)",
  "short_code": "string (required, 1-10 chars, uppercase)",
  "crest_url": "string (optional, valid URL)",
  "is_active": "boolean (optional, default: true)"
}
```

## 3. Used Types

### Command Models:
```typescript
// New type to be added to types.ts
export interface CreateTeamCommand {
  name: string;
  short_code: string;
  crest_url?: string;
  is_active?: boolean;
}
```

### Response DTOs:
```typescript
// Response will use TeamDto from existing types.ts
export type CreateTeamResponse = Pick<
  Database["public"]["Tables"]["teams"]["Row"],
  "id" | "name" | "short_code" | "crest_url"
> & {
  is_active: boolean;
  created_at: string;
  message: string;
};
```

### Validation Schema:
```typescript
// Zod schema for request validation
export const createTeamSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Team name is required")
    .max(255, "Team name too long"),
  short_code: z.string()
    .trim()
    .min(1, "Short code is required")
    .max(10, "Short code must be 10 characters or less")
    .toUpperCase(),
  crest_url: z.string()
    .url("Invalid URL format")
    .optional(),
  is_active: z.boolean()
    .optional()
    .default(true)
});
```

## 4. Response Details

### Success Response (201 Created):
```json
{
  "id": 19,
  "name": "Puszcza Niepołomice",
  "short_code": "PUS",
  "crest_url": "https://example.com/puszcza-crest.png",
  "is_active": true,
  "created_at": "2025-10-15T14:30:00Z",
  "message": "Team created successfully"
}
```

### Error Responses:
- **400 Bad Request**: Invalid input data, validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User lacks admin privileges
- **409 Conflict**: Team name or short_code already exists
- **500 Internal Server Error**: Database or server errors

## 5. Data Flow

1. **Request Reception**: Astro API endpoint receives POST request
2. **Authentication**: Verify bearer token and extract user information
3. **Authorization**: Confirm user has admin role/permissions
4. **Input Validation**: Validate request body against Zod schema
5. **Uniqueness Check**: Verify team name and short_code don't exist
6. **Database Insertion**: Insert new team record into teams table
7. **Response Formation**: Return created team data with success message
8. **Error Handling**: Catch and properly format any errors

### Database Operations:
```sql
-- Uniqueness check
SELECT COUNT(*) FROM teams 
WHERE name = $1 OR short_code = $2;

-- Insert new team
INSERT INTO teams (name, short_code, crest_url, is_active)
VALUES ($1, $2, $3, $4)
RETURNING *;
```

## 6. Security Considerations

### Authentication & Authorization:
- **Bearer Token Validation**: Verify JWT token from Authorization header
- **Admin Role Check**: Confirm user has admin privileges (needs implementation)
- **Token Expiration**: Ensure token is not expired
- **User Verification**: Verify user exists and is active

### Input Validation:
- **SQL Injection Prevention**: Use parameterized queries via Supabase
- **Data Sanitization**: Trim and validate all string inputs
- **URL Validation**: Ensure crest_url is a valid, safe URL
- **Length Limits**: Enforce database field length constraints

### Rate Limiting:
- Consider implementing rate limiting for admin operations
- Log admin actions for audit trail

### Error Information Disclosure:
- Return generic error messages to avoid information leakage
- Log detailed errors server-side for debugging

## 7. Error Handling

### Validation Errors (400):
```json
{
  "error": "Validation failed",
  "details": {
    "name": ["Team name is required"],
    "short_code": ["Short code must be 10 characters or less"]
  }
}
```

### Authentication Errors (401):
```json
{
  "error": "Authentication required",
  "message": "Bearer token is missing or invalid"
}
```

### Authorization Errors (403):
```json
{
  "error": "Insufficient permissions",
  "message": "Admin access required"
}
```

### Conflict Errors (409):
```json
{
  "error": "Team already exists",
  "message": "Team name or short code already in use",
  "conflicts": ["name", "short_code"]
}
```

### Server Errors (500):
```json
{
  "error": "Internal server error",
  "message": "Unable to create team. Please try again later."
}
```

## 8. Performance Considerations

### Database Optimization:
- Leverage existing UNIQUE constraints on short_code
- Create index on name field for uniqueness checks
- Use single query for uniqueness validation

### Response Time:
- Target < 200ms response time for team creation
- Minimize database roundtrips
- Use efficient SELECT for conflict checking

### Caching:
- Consider caching team list for conflict checking if performance becomes an issue
- Invalidate caches after successful team creation

## 9. Implementation Steps

### 1. Database Schema Updates
- **Verify teams table structure** matches API requirements
- **Add is_active field** if not present in database schema
- **Ensure proper indexes** exist for name and short_code fields

### 2. Type Definitions
- **Add CreateTeamCommand** interface to types.ts
- **Create CreateTeamResponse** type for consistent responses
- **Export Zod validation schema** for request validation

### 3. Admin Authentication Service  
- **Create admin auth utility** in `src/lib/services/authService.ts`
- **Implement role checking** against user profile or claims
- **Add bearer token extraction** and validation helper

### 4. Team Service Creation
- **Create TeamService class** in `src/lib/services/teamService.ts`
- **Implement createTeam method** with validation and uniqueness checks
- **Add error handling** for database operations
- **Include audit logging** for admin actions

### 5. API Endpoint Implementation
- **Create API route** at `src/pages/api/teams.ts`
- **Add prerender = false** for dynamic API processing
- **Implement POST handler** with proper error handling
- **Add request validation** using Zod schema
- **Integrate authentication** and authorization checks

### 6. Service Integration
- **Inject Supabase client** from middleware context
- **Use TeamService** for business logic
- **Handle all error scenarios** with appropriate status codes
- **Format responses** consistently

### 7. Testing & Validation
- **Test authentication flows** (valid/invalid tokens)
- **Test authorization** (admin vs non-admin users)
- **Test validation** (required fields, formats, lengths)
- **Test uniqueness constraints** (duplicate names/codes)
- **Test error scenarios** (database errors, network issues)

### 8. Documentation & Security Review
- **Document endpoint** in API specification
- **Add usage examples** and error scenarios
- **Review security implementation** with team
- **Add monitoring/logging** for admin actions

### Implementation Priority Order:
1. Database schema verification/updates
2. Type definitions and validation schemas  
3. Admin authentication service
4. Team service with business logic
5. API endpoint implementation
6. Integration testing
7. Security review and documentation

### Files to Create/Modify:
- `src/types.ts` - Add CreateTeamCommand and validation schema
- `src/lib/services/authService.ts` - New admin auth service
- `src/lib/services/teamService.ts` - New team management service
- `src/pages/api/teams.ts` - New API endpoint
- Database migration - Add is_active field if needed
