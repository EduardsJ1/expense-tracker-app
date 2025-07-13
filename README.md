# Expense Tracker App

A modern, full-stack expense tracking application built with React, TypeScript, Node.js, and PostgreSQL. Track your income and expenses, manage recurring transactions, and visualize your financial data with interactive charts.

## 🛠️ Tech Stack

### Frontend

- **React** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Interactive charts and data visualization
- **Axios** - HTTP client for API requests

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Cron** - Regular (every 1 hour) recurring transaction updates

## Features

### Transaction Management

- **Add/Edit/Delete Transactions**: Create and manage income and expense transactions
- **Recurring Transactions**: Set up automatic recurring transactions (monthly, yearly, etc.)
- **Categories**: Organize transactions with custom categories
- **Search & Filter**: Advanced filtering by type, category, amount, and date range
- **Notes**: Add detailed descriptions to your transactions
- **Category Suggestions**: Choose categories based on previos ones or create new ones

### Data Visualization

- **Interactive Charts**: View your financial data with responsive charts
- **Monthly/Daily Summaries**: Aggregate data by different time periods
- **Balance Tracking**: Monitor your running balance over time
- **Income vs Expense Analysis**: Compare income and expense trends

### User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant updates without page refreshes
- **Pagination**: Efficient handling of large transaction datasets
- **Hover Tooltips**: Detailed information on hover for better UX

### 🔒 Security & Authentication

- **User Authentication**: Secure login and registration system
- **Protected Routes**: Role-based access control
- **Data Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error management

## 📸 Screenshots

### Dashboard Overview

![Dashboard Overview](./frontend/src/assets/screenshots/Dashboard.png)

### Transaction Management

![Transaction Management](./frontend/src/assets/screenshots/Transactions.png)

### Recurring Transaction Management

![Recurring Management](./frontend/src/assets/screenshots/Recurring.png)

### Analytics

![Analytics page](./frontend/src/assets/screenshots/Analytics.png)

### Mobile Responsive Design

![Mobile View](./frontend/src/assets/screenshots/mobile_navbar.png)

### Create Modals

![Recurring Transaction modal](./frontend/src/assets/screenshots/recurring_Modal.png)

## Env variables

### Backend .env

PORT=8000
DATABASE_URL={DatabaseURL}
JWT_SECRET={SECRET}

### Frontend .env

VITE_API_URL={Server API url}
