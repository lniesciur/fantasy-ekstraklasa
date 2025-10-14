# API Endpoint Implementation Plan: Upload and Validate Excel File

## 1. Endpoint Overview

This endpoint handles the upload and validation of Excel files containing player data for the Fantasy Ekstraklasa system. It validates the file structure, data integrity, and provides detailed feedback on any issues found. The endpoint supports both .xlsx and .xls formats with a maximum file size of 5MB.

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/data/import/validate`
- **Parameters**:
  - Required: `file` (multipart/form-data)
  - Optional: None
- **Request Body**: Multipart form data with Excel file
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: multipart/form-data

## 3. Used Types

### DTOs and Command Models
- `ImportValidationCommand` - Internal service input type
- `ValidationResponse` - API response structure
- `ImportPlayerRow` - Parsed Excel row structure
- `ValidationIssue` - Individual validation error/warning
- `ValidationSeverity` - "warning" | "error"

### Database Resources
- `import_logs` table for tracking validation sessions
- `teams` table for team name validation
- `players` table for existing player data validation

## 4. Response Details

### Success Response (200)
```json
{
  "validation_id": "validate-uuid",
  "status": "success",
  "data_preview": [ImportPlayerRow[]],
  "statistics": {
    "total_rows": number,
    "valid_rows": number,
    "warnings": number,
    "errors": number
  },
  "validation_results": {
    "warnings": ValidationIssue[],
    "errors": ValidationIssue[]
  },
  "can_import": boolean,
  "expires_at": string
}
```

### Error Response (400)
```json
{
  "status": "error",
  "statistics": {
    "total_rows": number,
    "valid_rows": number,
    "warnings": number,
    "errors": number
  },
  "validation_results": {
    "errors": ValidationIssue[],
    "warnings": ValidationIssue[]
  },
  "can_import": false
}
```

## 5. Data Flow

1. **File Upload**: Receive multipart form data with Excel file
2. **Authentication**: Verify user token via Supabase Auth
3. **File Validation**: Check file size (max 5MB) and format (.xlsx/.xls)
4. **Excel Parsing**: Parse Excel file using xlsx library
5. **Data Validation**: 
   - Validate required columns exist
   - Check data types and formats
   - Validate team names against database
   - Check for duplicate players
   - Validate position values
   - Check price ranges and numeric fields
6. **Database Queries**: Fetch existing teams and players for validation
7. **Response Generation**: Create validation results with statistics
8. **Logging**: Store validation session in import_logs table

## 6. Security Considerations

- **Authentication**: Require valid Bearer token via Supabase Auth
- **File Size Limits**: Enforce 5MB maximum file size
- **File Type Validation**: Only allow .xlsx and .xls files
- **Content Validation**: Scan for malicious content in Excel files
- **Rate Limiting**: Implement rate limiting for file uploads
- **Input Sanitization**: Sanitize all parsed data before processing
- **SQL Injection Prevention**: Use parameterized queries

## 7. Error Handling

### Client Errors (4xx)
- **400 Bad Request**: Invalid file format, missing required fields, validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **413 Payload Too Large**: File exceeds 5MB limit
- **415 Unsupported Media Type**: File is not Excel format

### Server Errors (5xx)
- **500 Internal Server Error**: Excel parsing failure, database connection issues
- **503 Service Unavailable**: Database temporarily unavailable

### Validation Errors
- Missing required columns
- Invalid data types (non-numeric prices, invalid positions)
- Unknown team names
- Duplicate player entries
- Invalid health status values
- Out-of-range numeric values

## 8. Performance Considerations

- **File Size Optimization**: Implement streaming for large files
- **Memory Management**: Process Excel files in chunks to avoid memory issues
- **Database Optimization**: Use indexed queries for team/player lookups
- **Caching**: Cache team names and validation rules
- **Async Processing**: Consider async validation for very large files
- **Timeout Handling**: Set appropriate timeouts for file processing

## 9. Implementation Steps

1. **Setup Dependencies**
   - Install `xlsx` library for Excel parsing
   - Install `multer` for multipart form handling
   - Install `zod` for data validation

2. **Create Validation Service**
   - Implement `ExcelValidationService` class
   - Add methods for file parsing and data validation
   - Implement team name validation against database
   - Add data type and range validation

3. **Create API Endpoint**
   - Set up POST route `/api/data/import/validate`
   - Implement multipart form handling
   - Add authentication middleware
   - Implement file size and type validation

4. **Implement Data Validation Logic**
   - Parse Excel file and extract data
   - Validate required columns (name, team, position, price, etc.)
   - Check data types and ranges
   - Validate against existing database records
   - Generate detailed validation results

5. **Add Database Integration**
   - Query teams table for name validation
   - Check for existing players
   - Store validation session in import_logs
   - Implement proper error handling

6. **Create Response Formatting**
   - Format validation results as JSON
   - Include statistics and preview data
   - Add proper HTTP status codes
   - Include validation ID for tracking

7. **Add Error Handling**
   - Implement comprehensive error catching
   - Add proper HTTP status codes
   - Create user-friendly error messages
   - Log errors for debugging

8. **Testing and Validation**
   - Test with various Excel file formats
   - Test with invalid data scenarios
   - Test file size limits
   - Test authentication requirements
   - Test database integration

9. **Documentation and Deployment**
   - Update API documentation
   - Add endpoint to API plan
   - Deploy to staging environment
   - Perform integration testing

10. **Monitoring and Logging**
    - Add request logging
    - Monitor validation performance
    - Track error rates
    - Set up alerts for failures
