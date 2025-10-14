# API Endpoint Implementation Plan: Create Gameweek

## 1. Endpoint Overview

The Create Gameweek endpoint allows administrators to create new gameweeks in the Fantasy Ekstraklasa system. This endpoint is restricted to admin users only and creates a new gameweek with a unique number, start date, and end date. The endpoint validates input data, checks for duplicate gameweek numbers, and returns the created gameweek with computed status information.

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/gameweeks`
- **Parameters**:
  - **Required**: 
    - `number` (integer): Unique gameweek number
    - `start_date` (string): Gameweek start date in YYYY-MM-DD format
    - `end_date` (string): Gameweek end date in YYYY-MM-DD format
  - **Optional**: None
- **Request Body**: JSON object with gameweek creation data
- **Headers**: 
  - `Authorization: Bearer {token}` (admin role required)
  - `Content-Type: application/json`

## 3. Used Types

### Command Models:
```typescript
interface CreateGameweekCommand {
  number: number;
  start_date: string;
  end_date: string;
}
```

### DTOs:
```typescript
interface CreateGameweekResponse {
  id: number;
  number: number;
  start_date: string;
  end_date: string;
  status: "upcoming" | "active" | "completed";
  created_at: string;
  message: string;
}
```

### Validation Schema:
```typescript
const createGameweekSchema = z.object({
  number: z.number().int().positive("Gameweek number must be positive"),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
}).refine(data => new Date(data.start_date) < new Date(data.end_date), {
  message: "Start date must be before end date",
  path: ["start_date"]
});
```

## 4. Response Details

### Success Response (201):
```json
{
  "id": 16,
  "number": 16,
  "start_date": "2025-10-21",
  "end_date": "2025-10-23",
  "status": "upcoming",
  "created_at": "2025-10-15T14:30:00Z",
  "message": "Gameweek created successfully"
}
```

### Error Responses:
- **400**: Invalid input data, validation errors
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (not admin role)
- **409**: Conflict (gameweek number already exists)
- **500**: Internal server error

## 5. Data Flow

1. **Authentication**: Verify JWT token and extract user information
2. **Authorization**: Check if user has admin role
3. **Input Validation**: Validate request body using Zod schema
4. **Business Logic Validation**: 
   - Check for duplicate gameweek numbers
   - Validate date logic (start_date < end_date)
5. **Database Operation**: Insert new gameweek record
6. **Response Generation**: Return created gameweek with computed status
7. **Error Handling**: Catch and format any errors appropriately

## 6. Security Considerations

- **Authentication**: JWT token validation required
- **Authorization**: Admin role verification mandatory
- **Input Validation**: Comprehensive validation of all input fields
- **SQL Injection Prevention**: Use parameterized queries through Supabase client
- **Data Sanitization**: Validate and sanitize date inputs
- **Rate Limiting**: Consider implementing rate limiting for admin endpoints
- **Audit Logging**: Log all gameweek creation attempts for security monitoring

## 7. Error Handling

### Validation Errors (400):
- Missing required fields
- Invalid date format
- Start date after end date
- Non-positive gameweek number

### Authentication Errors (401):
- Missing Authorization header
- Invalid JWT token
- Expired token

### Authorization Errors (403):
- User doesn't have admin role
- Insufficient permissions

### Business Logic Errors (409):
- Gameweek number already exists
- Conflicting date ranges

### Server Errors (500):
- Database connection issues
- Unexpected server errors
- Service unavailability

## 8. Performance Considerations

- **Database Indexing**: Ensure `gameweeks.number` has unique index for fast duplicate checking
- **Connection Pooling**: Use Supabase connection pooling for database operations
- **Response Caching**: Consider caching gameweek status computations
- **Query Optimization**: Use efficient queries for duplicate checking
- **Memory Management**: Validate input size limits to prevent memory issues

## 9. Implementation Steps

1. **Create GameweekService**:
   - Implement `createGameweek()` method
   - Add duplicate checking logic
   - Handle database operations

2. **Create Validation Schema**:
   - Implement Zod schema for request validation
   - Add custom validation for date logic
   - Handle validation error formatting

3. **Create API Endpoint**:
   - Set up POST `/api/gameweeks` route
   - Implement authentication middleware
   - Add admin role verification

4. **Implement Request Handler**:
   - Parse and validate request body
   - Call GameweekService.createGameweek()
   - Format and return response

5. **Add Error Handling**:
   - Implement comprehensive error catching
   - Format error responses consistently
   - Add logging for debugging

6. **Add Response Formatting**:
   - Compute gameweek status based on dates
   - Format timestamps consistently
   - Include success messages

7. **Testing**:
   - Unit tests for GameweekService
   - Integration tests for API endpoint
   - Error scenario testing
   - Admin role verification testing

8. **Documentation**:
   - Update API documentation
   - Add example requests/responses
   - Document error scenarios
