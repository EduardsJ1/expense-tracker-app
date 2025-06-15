# Expense Tracker Backend API

A RESTful API for managing personal expenses and income transactions built with Node.js, Express, TypeScript, and PostgreSQL.

## TODO / Work in Progress

- [ ] **React Frontend** - User interface for transaction management and analytics charts
- [ ] **Financial Prediction System** - Monthly forecasting based on recurring transactions
- [ ] **Rate Limiter** - API request rate limiting and security

## Features

- User authentication with JWT tokens
- Transaction management (CRUD operations)
- Recurring transactions with automated processing
- Advanced filtering and search capabilities
- Transaction summaries and analytics
- Pagination support
- Category management
- Automated cron jobs for recurring transaction processing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Task Scheduling**: node-cron (for recurring transactions)
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

### Recurring Transactions

#### Create Recurring Transaction

- **POST** `/recurring`
- **Auth**: Required
- **Body**:
  ```json
  {
    "amount": 1500.0,
    "type": "income", // or "expense"
    "category": "salary",
    "note": "Monthly salary", // optional
    "recurrence_type": "calendar", // "calendar" or "hourly"
    "calendar_unit": "monthly", // required if recurrence_type is "calendar": "daily", "weekly", "monthly", "yearly"
    "interval_hours": 24, // required if recurrence_type is "hourly"
    "start_date": "2024-01-01T00:00:00Z", // optional, defaults to current date/time
    "end_date": "2024-12-31T23:59:59Z", // optional
    "is_active": true // optional, defaults to true
  }
  ```

#### Get Recurring Transactions (with filtering)

- **GET** `/recurring`
- **Auth**: Required
- **Query Parameters**:
  - `includeUpdated` (boolean): Use updated_at instead of created_at for date filtering
  - `from` (string): Start date (YYYY-MM-DD format)
  - `to` (string): End date (YYYY-MM-DD format)
  - `type` (string): Filter by "income" or "expense"
  - `category` (string): Filter by category (single: "food" or multiple: "food,transport,entertainment")
  - `recurrence_type` (string): Filter by "calendar" or "hourly"
  - `is_active` (boolean): Filter by active/inactive status
  - `minAmount` (number): Minimum transaction amount
  - `maxAmount` (number): Maximum transaction amount
  - `sortBy` (string): Sort field ("created_at", "amount", "type", "category", "updated_at", "recurrence_type", "interval_hours", "calendar_unit", "start_date", "end_date", "next_occurrence", "is_active") - default: "created_at"
  - `sortOrder` (string): Sort direction ("asc" or "desc") - default: "desc"
  - `page` (number): Page number for pagination - default: 1
  - `items` (number): Items per page - default: 10
  - `search` (string): Search in note and category fields
  - `hasNote` (boolean): Filter transactions with/without notes

**Example**: `/recurring?type=income&recurrence_type=calendar&is_active=true&category=salary&page=1&items=10`

#### Update Recurring Transaction

- **PATCH** `/recurring/:id`
- **Auth**: Required
- **Body** (all fields optional):
  ```json
  {
    "amount": 1600.0,
    "type": "income", // or "expense"
    "category": "updated_salary",
    "note": "Updated monthly salary", // optional
    "recurrence_type": "calendar", // "calendar" or "hourly"
    "calendar_unit": "monthly", // required if recurrence_type is "calendar": "daily", "weekly", "monthly", "yearly"
    "interval_hours": 24, // required if recurrence_type is "hourly"
    "start_date": "2024-01-01T00:00:00Z", // optional
    "end_date": "2024-12-31T23:59:59Z", // optional
    "is_active": true // optional
  }
  ```
- **Response**: Updated recurring transaction details
- **Note**: When updating recurrence-related fields (start_date, recurrence_type, interval_hours, calendar_unit), the next_occurrence is automatically recalculated

#### Delete Recurring Transaction

- **DELETE** `/recurring/:id`
- **Auth**: Required
- **Response**: Deleted recurring transaction details

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

## Recurring Transaction Processing

The application includes an automated background job that processes recurring transactions:

- **Schedule**: Runs every hour via cron job
- **Process**: Checks for active recurring transactions where `next_occurrence <= current_time`
- **Actions**:
  - Creates new transactions based on recurring configuration
  - Updates `next_occurrence` date for future processing
  - Automatically deactivates recurring transactions when `end_date` is reached
  - Handles both calendar-based (daily, weekly, monthly, yearly) and hourly intervals

### Recurring Transaction Types

1. **Calendar-based**:

   - `recurrence_type: "calendar"`
   - Supported units: daily, weekly, monthly, yearly
   - Uses calendar dates for accurate scheduling

2. **Hourly-based**:
   - `recurrence_type: "hourly"`
   - Custom interval in hours (e.g., every 6 hours, 24 hours, etc.)
   - More flexible for non-standard schedules

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
- `recurring_id` (Foreign Key, Optional) - Links to recurring transaction that created this transaction
- `created_at`
- `updated_at`

### Recurring Table

- `id` (Primary Key)
- `user_id` (Foreign Key)
- `amount` (Decimal)
- `type` (income/expense)
- `category` (String)
- `note` (Text, Optional)
- `recurrence_type` (calendar/hourly)
- `calendar_unit` (daily/weekly/monthly/yearly, Optional)
- `interval_hours` (Integer, Optional)
- `start_date` (Timestamp)
- `end_date` (Timestamp, Optional)
- `next_occurrence` (Timestamp)
- `is_active` (Boolean)
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
│   ├── transactions.ts
│   └── recurring_transactions.ts
├── routes/         # Route definitions
│   ├── index.ts
│   ├── users.ts
│   ├── transactions.ts
│   └── recurring.ts
├── jobs/           # Background job processing
│   └── recurring.ts
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
