# API Endpoint Implementation Plan: Download Excel Template

## 1. Endpoint Overview
This endpoint provides a downloadable Excel template file that users can use for manual data import. The template includes current teams, players, and gameweeks data in a structured format that matches the import validation requirements.

## 2. Request Details
- **HTTP Method**: GET
- **URL Structure**: `/api/data/template`
- **Parameters**: None
- **Request Body**: None
- **Headers**: 
  - `Authorization: Bearer {token}` (required)

## 3. Used Types
- **Authentication**: Uses Supabase auth token validation
- **Response**: File download (no JSON DTOs needed)
- **Internal**: Uses existing `TeamDto`, `PlayerDto`, `GameweekDto` types for template data

## 4. Response Details
- **Status Code**: 200 (Success)
- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Headers**:
  ```
  Content-Disposition: attachment; filename="fantasy_ekstraklasa_szablon_2025.xlsx"
  Content-Length: [file_size]
  ```
- **Body**: Excel file binary data

## 5. Data Flow
1. Validate Bearer token with Supabase Auth
2. Fetch current teams, players, and gameweeks from database
3. Generate Excel template using xlsx library
4. Set appropriate response headers
5. Stream file to client

## 6. Security Considerations
- **Authentication**: Bearer token validation required
- **Authorization**: All authenticated users can download template
- **Rate Limiting**: Implement to prevent abuse
- **File Generation**: Validate data before generating template
- **Content Security**: Ensure template contains only safe, structured data

## 7. Error Handling
- **401 Unauthorized**: Invalid or missing Bearer token
- **500 Internal Server Error**: File generation failure, database connection issues
- **429 Too Many Requests**: Rate limiting exceeded
- **503 Service Unavailable**: Database unavailable

## 8. Performance Considerations
- **Caching**: Cache template generation for 1 hour to reduce database load
- **File Size**: Optimize Excel structure to minimize file size
- **Database Queries**: Use efficient queries to fetch template data
- **Memory Usage**: Stream file generation to avoid memory issues with large datasets

## 9. Implementation Steps

1. **Create Template Service**
   - Create `src/lib/services/templateService.ts`
   - Implement `generateExcelTemplate()` method
   - Use xlsx library for Excel generation

2. **Create API Endpoint**
   - Create `src/pages/api/data/template.ts`
   - Implement GET handler with authentication
   - Add rate limiting middleware

3. **Add Dependencies**
   - Install `xlsx` package for Excel generation
   - Add rate limiting package if needed

4. **Implement Authentication**
   - Validate Bearer token using Supabase client
   - Return 401 for invalid tokens

5. **Fetch Template Data**
   - Query teams, players, and gameweeks from database
   - Use existing service methods for data fetching

6. **Generate Excel Template**
   - Create structured Excel with multiple sheets
   - Include teams, players, and gameweeks data
   - Add validation rules and formatting

7. **Set Response Headers**
   - Set correct Content-Type for Excel files
   - Set Content-Disposition for file download
   - Set Content-Length header

8. **Add Error Handling**
   - Wrap in try-catch blocks
   - Log errors appropriately
   - Return appropriate HTTP status codes

9. **Add Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Use Redis or in-memory store for rate limiting

10. **Add Caching**
    - Cache generated template for 1 hour
    - Invalidate cache when data changes
    - Use Redis or file system cache

11. **Testing**
    - Test authentication with valid/invalid tokens
    - Test file generation with various data scenarios
    - Test rate limiting functionality
    - Test error handling scenarios

12. **Documentation**
    - Update API documentation
    - Add example usage
    - Document template structure and format
