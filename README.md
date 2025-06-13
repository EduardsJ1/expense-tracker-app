# Expense Tracker Backend API

A RESTful API for managing personal expenses and income transactions built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- User authentication with JWT tokens
- Transaction management (CRUD operations)
- Advanced filtering and search capabilities
- Transaction summaries and analytics
- Pagination support
- Category management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Development**: nodemon, ts-node

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Docker (optional, for database setup)

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file:

   ```env
   PORT=8000
   DATABASE_URL=postgresql://postgres:password123@localhost:5432/expense_db
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start PostgreSQL database (using Docker):

   ```bash
   docker-compose up -d
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8000`

## API Endpoints

### Authentication

#### Register User

- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name" // optional
  }
  ```
- **Response**: User details with ID

#### Login User

- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Sets HTTP-only cookie with JWT token

### Users

#### Get All Users

- **GET** `/users`
- **Auth**: Not required
- **Response**: Array of all users

#### Get Current User Info

- **GET** `/users/me`
- **Auth**: Required
- **Response**: Current user details

### Transactions

#### Create Transaction

- **POST** `/transactions`
- **Auth**: Required
- **Body**:
  ```json
  {
    "amount": 100.5,
    "type": "income", // or "expense"
    "category": "salary",
    "note": "Monthly salary" // optional
  }
  ```

#### Get Transactions (with filtering)

- **GET** `/transactions`
- **Auth**: Required
- **Query Parameters**:
  - `includeUpdated` (boolean): Use updated_at instead of created_at for date filtering
  - `from` (string): Start date (YYYY-MM-DD format)
  - `to` (string): End date (YYYY-MM-DD format)
  - `type` (string): Filter by "income" or "expense"
  - `category` (string): Filter by category (single: "food" or multiple: "food,transport,entertainment")
  - `minAmount` (number): Minimum transaction amount
  - `maxAmount` (number): Maximum transaction amount
  - `sortBy` (string): Sort field ("created_at", "amount", "type", "category", "updated_at") - default: "created_at"
  - `sortOrder` (string): Sort direction ("asc" or "desc") - default: "desc"
  - `page` (number): Page number for pagination - default: 1
  - `items` (number): Items per page - default: 10
  - `search` (string): Search in note and category fields
  - `hasNote` (boolean): Filter transactions with/without notes

**Example**: `/transactions?type=expense&category=food,transport&minAmount=10&maxAmount=100&page=1&items=20&search=lunch`

#### Get Single Transaction

- **GET** `/transactions/:id`
- **Auth**: Required
- **Response**: Transaction details

#### Update Transaction

- **PATCH** `/transactions/:id`
- **Auth**: Required
- **Body** (all fields optional):
  ```json
  {
    "amount": 150.0,
    "type": "expense",
    "category": "food",
    "note": "Updated note"
  }
  ```

#### Delete Transaction

- **DELETE** `/transactions/:id`
- **Auth**: Required
- **Response**: Deleted transaction details

#### Get Transaction Summary

- **GET** `/transactions/summary`
- **Auth**: Required
- **Query Parameters**:
  - `groupBy` (string): Group results by "category", "year", "month", or "day"
  - `from` (string): Start date (YYYY-MM-DD)
  - `to` (string): End date (YYYY-MM-DD)

**Examples**:

- `/transactions/summary` - Overall summary
- `/transactions/summary?groupBy=category` - Summary by category
- `/transactions/summary?groupBy=month&from=2023-01-01&to=2023-12-31` - Monthly summary for 2023

#### Get Transaction Categories

- **GET** `/transactions/categories`
- **Auth**: Required
- **Response**: Array of unique categories used by the user

## Response Formats

### Success Response

Most endpoints return JSON data directly or with additional metadata for pagination/summaries.

### Error Response

```json
{
  "message": "Error description"
}
```

## Authentication

The API uses JWT tokens stored in HTTP-only cookies. After successful login, the token is automatically included in subsequent requests. Token expires after 2 hours.

## Database Schema

### Users Table

- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `name`
- `created_at`
- `updated_at`

### Transactions Table

- `id` (Primary Key)
- `user_id` (Foreign Key)
- `amount` (Decimal)
- `type` (income/expense)
- `category` (String)
- `note` (Text, Optional)
- `created_at`
- `updated_at`

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests (not implemented)

### Project Structure

```
src/
├── controllers/     # Route handlers
│   ├── users.ts
│   └── transactions.ts
├── routes/         # Route definitions
│   ├── index.ts
│   ├── users.ts
│   └── transactions.ts
├── middlewere/     # Custom middleware
│   └── index.ts
├── helpers/        # Utility functions
│   └── index.ts
├── db.ts          # Database connection
└── index.ts       # Application entry point
```

## Environment Variables

| Variable       | Description                  | Example                                            |
| -------------- | ---------------------------- | -------------------------------------------------- |
| `PORT`         | Server port                  | `8000`                                             |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/dbname` |
| `JWT_SECRET`   | Secret key for JWT tokens    | `your_secret_key`                                  |

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## License

This project is licensed under the ISC License.
