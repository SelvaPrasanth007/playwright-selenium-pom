# API Automation Tests

Automated API testing suite for Freelance Learn Automation backend.

## Overview

This folder contains comprehensive API testing using Jest and Axios.

**API Endpoint:** `https://freelance-learn-automation.vercel.app/login`

**Headers:** `Accept: application/json`

## Project Structure

```
api/
├── src/
│   ├── __tests__/
│   │   └── login.test.ts          # Login API test cases
│   └── utils/
│       └── APIClient.ts           # Reusable API client
├── .env                           # Environment variables
├── jest.config.js                 # Jest configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── README.md                       # This file
```

## Installation

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Setup

1. Navigate to api folder:
```bash
cd api
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Environment Variables (.env)

```env
BASE_URL=https://freelance-learn-automation.vercel.app
API_ENDPOINT=/login
HEADER_ACCEPT=application/json
```

## Available Scripts

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Coverage

### Login API Tests

#### GET /login
- ✅ Returns 200 status
- ✅ Returns proper content type
- ✅ Response structure validation

#### POST /login - Credential Validation
- ✅ Missing credentials (empty object)
- ✅ Invalid credentials
- ✅ Missing username
- ✅ Missing password
- ✅ Empty string credentials
- ✅ Special characters in credentials
- ✅ Very long credentials
- ✅ SQL injection attempts

#### Response Headers Validation
- ✅ Required security headers
- ✅ Correct Accept header
- ✅ Content-Type header

#### Response Body Validation
- ✅ Structured response object
- ✅ Error message format
- ✅ Status codes

#### Performance Tests
- ✅ Response time within limits (< 30s)
- ✅ Handles concurrent requests

## Test Scenarios

### 1. Authentication Tests
```typescript
POST /login
{
  "username": "user@example.com",
  "password": "password123"
}
```

Expected: 
- Valid credentials → 200 OK with token
- Invalid credentials → 401 Unauthorized
- Missing fields → 400 Bad Request

### 2. Input Validation Tests
- Empty credentials
- Special characters
- Long strings
- SQL injection patterns
- XSS attempts

### 3. Performance Tests
- Response time measurement
- Concurrent request handling
- Load testing capability

## API Client Usage

### Basic GET Request
```typescript
const apiClient = new APIClient();
const response = await apiClient.get('/login');
```

### POST Request with Data
```typescript
const response = await apiClient.post('/login', {
  username: 'user@example.com',
  password: 'password123'
});
```

### Custom Headers
```typescript
apiClient.setHeaders({
  'Authorization': 'Bearer token123',
  'X-Custom-Header': 'value'
});
```

### Error Handling
```typescript
try {
  const response = await apiClient.post('/login', data);
} catch (error) {
  console.error('Status:', error.response?.status);
  console.error('Data:', error.response?.data);
}
```

## Key Features

✨ **Type-Safe:** Full TypeScript support with type hints

🔒 **Security Focused:** Tests for SQL injection, XSS, and input validation

⚡ **Performance Testing:** Measures response times and concurrent handling

📊 **Comprehensive Coverage:** 15+ test scenarios

🛠️ **Reusable Client:** APIClient can be used across multiple test suites

🔧 **Easy Configuration:** Environment-based configuration

## Expected Test Results

When running tests:
- Some tests may return 400/401/422 (expected for invalid credentials)
- 404 responses indicate endpoint not found
- 405 indicates method not allowed (GET vs POST)

All status codes are properly handled and validated.

## Troubleshooting

### Tests timing out
Increase timeout in jest.config.js:
```javascript
testTimeout: 60000 // 60 seconds
```

### Connection refused
Check:
- Network connectivity
- BASE_URL is correct in .env
- API endpoint is accessible

### Module not found errors
Reinstall dependencies:
```bash
npm install
```

## Dependencies

- **jest:** Testing framework
- **ts-jest:** TypeScript support for Jest
- **axios:** HTTP client
- **dotenv:** Environment variables
- **typescript:** Type safety

## Best Practices

1. **Always use try-catch** for API calls
2. **Set proper timeouts** for external APIs
3. **Validate response status codes** explicitly
4. **Log important test steps** for debugging
5. **Use environment variables** for configuration
6. **Test both success and failure cases**

## Contributing

When adding new test cases:
1. Add to appropriate describe block
2. Include console logs for debugging
3. Validate both status and response data
4. Test edge cases (empty, null, special characters)
5. Add comments explaining the test purpose

## Support

For issues or questions:
1. Check API endpoint is accessible
2. Verify environment variables
3. Check network connectivity
4. Review test output logs

---

**Last Updated:** December 2025
