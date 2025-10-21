# Stage 1 Project - String Analysis API

A RESTful API for analyzing and managing strings with various properties and filtering capabilities.

## Features

- String analysis with comprehensive properties
- In-memory storage for analyzed strings
- Rate limiting (100 requests per 15 minutes)
- CORS support
- Request validation using Zod
- Structured logging with Pino
- Duplicate string detection

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

### Running the Application

**Development mode:**
```bash
pnpm run dev
```

**Production mode:**
```bash
pnpm run build
pnpm start
```

The server will start on port 3000.

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Health Check
```
GET /
```
Returns a simple "Hello, World!" message to verify the API is running.

**Response:**
```
Hello, World!
```

#### 2. Analyze String
```
POST /strings
```
Analyzes a string and stores it with comprehensive properties.

**Request Body:**
```json
{
  "value": "string to analyze"
}
```

**Success Response (201):**
```json
{
  "result": {
    "id": "sha256_hash_of_string",
    "value": "string to analyze",
    "properties": {
      "length": 16,
      "is_palindrome": false,
      "sha256_hash": "abc123...",
      "unique_characters": 12,
      "word_count": 3,
      "character_frequency_map": {
        "s": 2,
        "t": 4,
        "r": 2
      }
    },
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing or invalid request body
- `409 Conflict`: String already exists
- `422 Unprocessable Entity`: Invalid data type for "value" (must be string)

#### 3. Get Filtered Strings
```
GET /strings
```
Retrieves stored strings with optional filtering capabilities.

**Query Parameters:**
- `is_palindrome` (boolean): Filter palindromes (`true` to show only palindromes)
- `min_length` (number): Minimum string length
- `max_length` (number): Maximum string length
- `word_count` (number): Exact word count
- `contains_character` (string): Filter strings containing specific character

**Example Request:**
```
GET /strings?is_palindrome=true&min_length=5&max_length=20
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "hash1",
      "value": "racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "sha256_hash": "hash1",
        "unique_characters": 4,
        "word_count": 1,
        "character_frequency_map": {
          "r": 2,
          "a": 2,
          "c": 2,
          "e": 1
        }
      },
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": "true",
    "min_length": "5",
    "max_length": "20",
    "word_count": null,
    "contains_character": null
  }
}
```

## String Analysis Properties

Each analyzed string includes the following properties:

- **id**: SHA256 hash of the string (also serves as unique identifier)
- **value**: The original string
- **length**: Number of characters in the string
- **is_palindrome**: Whether the string reads the same forwards and backwards (ignoring case and non-alphanumeric characters)
- **sha256_hash**: Cryptographic hash of the string
- **unique_characters**: Count of unique characters
- **word_count**: Number of words (separated by whitespace)
- **character_frequency_map**: Object mapping each character to its frequency
- **created_at**: ISO timestamp of when the string was analyzed

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit**: 100 requests per 15-minute window
- **Scope**: Per IP address
- **Response**: HTTP 429 when limit exceeded

## Error Handling

The API uses structured error handling:

- **400 Bad Request**: Invalid request format or missing required fields
- **404 Not Found**: Requested resource doesn't exist
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Invalid data types
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected server errors

## Development

### Project Structure

```
src/
├── controllers/          # Request handlers
├── routes/              # Route definitions
├── utils/               # Utility functions
├── app.ts              # Express app configuration
└── index.ts            # Server entry point
```

### Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Compile TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm test` - Run tests (not implemented yet)

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **Logging**: Pino
- **Rate Limiting**: express-rate-limit
- **CORS**: cors
- **Package Manager**: pnpm
