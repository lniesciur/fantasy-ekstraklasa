# API Endpoint Implementation Plan: Execute Data Import

## 1. Endpoint Overview

The Execute Data Import endpoint processes validated Excel data and imports it into the database. It takes a validation_id from a previous validation step and executes the actual data import with specified overwrite behavior. The endpoint handles player data import with comprehensive error handling and progress tracking.

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/data/import/execute`
- **Parameters**:
  - Required: 
    - `validation_id` (string, UUID) - Reference to validated data
    - `overwrite_mode` (string) - Import behavior: "replace_existing", "update_only", "create_only"
  - Optional:
    - `gameweek_id` (number) - Target gameweek for player stats
- **Request Body**:
```json
{
  "validation_id": "validate-uuid",
  "overwrite_mode": "replace_existing",
  "gameweek_id": 15
}
```

## 3. Used Types

- **ImportCommand** - Request body validation
- **ImportResult** - Success response structure
- **ImportStatusResponse** - Status checking response
- **ImportPlayerRow** - Individual player data structure
- **ValidationResponse** - Source validation data

## 4. Response Details

- **Success (201)**: Import completed with detailed results
- **Error (400)**: Invalid request parameters
- **Error (401)**: Unauthorized access
- **Error (404)**: Validation not found or expired
- **Error (409)**: Import already in progress
- **Error (500)**: Server error during import

## 5. Data Flow

1. **Authentication**: Verify user authorization
2. **Validation**: Check validation_id exists and is not expired
3. **Lock Check**: Ensure no concurrent import for same validation
4. **Data Retrieval**: Fetch validated data from validation cache
5. **Import Execution**: Process data based on overwrite_mode
6. **Database Operations**: Insert/update players and player_stats
7. **Progress Tracking**: Update import_logs with progress
8. **Result Generation**: Calculate import statistics
9. **Response**: Return comprehensive import results

## 6. Security Considerations

- **Authentication**: Require valid user session via Supabase Auth
- **Authorization**: Check user permissions for data import
- **Input Validation**: Strict validation of all input parameters
- **SQL Injection**: Use parameterized queries via Supabase client
- **Race Conditions**: Implement import locking mechanism
- **Data Integrity**: Validate all imported data against schema constraints

## 7. Error Handling

- **400 Bad Request**: Invalid validation_id format, invalid overwrite_mode
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Validation_id not found or expired (>24h)
- **409 Conflict**: Import already in progress for this validation
- **410 Gone**: Validation data expired or corrupted
- **500 Internal Server Error**: Database errors, service failures
- **Logging**: All errors logged to import_logs table with details

## 8. Performance Considerations

- **Batch Processing**: Process players in batches of 100-500
- **Transaction Management**: Use database transactions for consistency
- **Progress Updates**: Update import_logs every 50 records
- **Memory Management**: Stream large datasets to avoid memory issues
- **Timeout Handling**: Set reasonable timeouts for long imports
- **Concurrent Limits**: Limit concurrent imports per user

## 9. Implementation Steps

1. **Create Import Service** (`src/lib/services/importService.ts`)
   - Implement validation_id lookup
   - Handle overwrite_mode logic
   - Manage import progress tracking

2. **Implement Endpoint** (`src/pages/api/data/import/execute.ts`)
   - Add request validation with Zod
   - Implement authentication middleware
   - Handle error responses

3. **Database Operations**
   - Create import_logs entry
   - Process players in batches
   - Handle team lookups and creation
   - Update player_stats based on gameweek_id

4. **Error Handling**
   - Implement comprehensive error catching
   - Log errors to import_logs
   - Provide user-friendly error messages

5. **Testing**
   - Unit tests for import service
   - Integration tests for endpoint
   - Error scenario testing

6. **Documentation**
   - Update API documentation
   - Add usage examples
   - Document error codes

7. **Monitoring**
   - Add performance metrics
   - Implement import progress tracking
   - Set up error alerting

8. **Security Review**
   - Audit input validation
   - Test authorization flows
   - Verify data integrity checks
