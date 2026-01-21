
<div align="center">

<picture align="center">
  <source media="(prefers-color-scheme: dark)" srcset="logo-white.png">
  <source media="(prefers-color-scheme: light)" srcset="logo-black.png">
  <img alt="Helix" height="200" src="logo-white.png">
</picture>

**A robust and secure Node.js Express backend API for the FPBank application, enabling core banking functionalities like user authentication, account management, and secure transaction processing.**

</div>

## 📖 Overview

The Full Port Bank Backend is a simulated API service developed for an academic project, designed to model the functionality of a modern banking application. Built with Node.js and Express.js, it provides a secure and scalable foundation for managing mock user accounts, processing simulated financial transactions (deposits, withdrawals, transfers), and maintaining comprehensive transaction histories. With integrated authentication, data validation, and containerization support, this backend demonstrates key concepts in financial application development. The backend is designed to work seamlessly with the [Full Port Bank Frontend](https://github.com/joshperegrin/fpbank-frontend) client application.

**Tech Stack**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white) ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white) ![Supertest](https://img.shields.io/badge/Supertest-FFC700?style=for-the-badge&logo=jest&logoColor=black) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)


## ✨ Features

-   🎯 **User Authentication & Authorization**: Secure registration and login with JWT-based access control for API endpoints.
-   💳 **Account Management**: Create, view, and update simulated user accounts (e.g., checking, savings).
-   💰 **Transaction Processing**: Handle deposits, withdrawals, and fund transfers between accounts with robust validation.
-   📊 **Real-time Balance Inquiry**: Instantly retrieve current account balances.
-   📜 **Transaction History**: Track and retrieve detailed transaction logs for all accounts.
-   🔐 **Secure Data Handling**: Passwords hashed with bcrypt and sensitive data protected.
-   🔗 **RESTful API Interface**: Clean, intuitive API endpoints for easy integration with frontend applications.
-   🐳 **Containerized Deployment**: Ready for deployment using Docker for consistency and scalability.
-   🧪 **Comprehensive Testing**: Robust unit and integration tests ensure API reliability and correctness using Jest and Supertest.


## 🚀 Quick Start

### Prerequisites
Before you begin, ensure you have the following installed:
-   **Node.js**: v18.x or higher
-   **npm**: Node Package Manager (comes with Node.js)
-   **SQLite**: Database server (v14.x or higher recommended)
-   **Docker**: (Optional, for containerized development/deployment)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/joshperegrin/fpbank-backend.git
    cd fpbank-backend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment setup**
    Create a `.env` file in the root directory by copying the example (if provided, otherwise create manually):
    ```bash
    cp .env.example .env # If .env.example exists
    # Otherwise, create .env and add the following:
    ```
    Configure your environment variables:
    ```ini
    PORT=3000
    NODE_ENV=development
    JWT_SECRET="your_jwt_secret_key" # Change this to a strong, random key
    ```

4.  **Start development server**
    ```bash
    npm run dev
    ```

5.  **Verify server**
    The API should now be running on `http://localhost:[detected port, default 3000]`.

## 📁 Project Structure

```
fpbank-backend/
├── .dockerignore           # Specifies files to ignore when building Docker images
├── .gitignore              # Specifies intentionally untracked files to ignore
├── Dockerfile              # Docker container definition
├── db/                     # Database related files (migrations, models, seeders)
├── jest.config.js          # Configuration for Jest testing framework
├── jest.setup.js           # Jest setup script for test environment
├── node_modules/           # Installed Node.js dependencies
├── package-lock.json       # Records the exact dependency tree
├── package.json            # Project metadata and dependencies
├── src/                    # Main application source code
│   ├── app.js              # Express application setup
│   ├── index.js            # Application entry point
│   ├── routes/             # Defines API endpoints and links to controllers
│   ├── controllers/        # Handles request logic, interacts with services/models
│   ├── models/             # Database schema definitions (e.g., Sequelize models)
│   ├── services/           # Business logic and data manipulation
│   ├── middleware/         # Custom Express middleware (e.g., authentication, error handling)
│   └── utils/              # Utility functions and helpers
└── tests/                  # Application test files (unit and integration tests)
    ├── unit/               # Unit tests for individual functions/modules
    └── integration/        # Integration tests for API endpoints
```

## 🧪 Testing

The project uses Jest for robust unit and integration testing. `Supertest` is likely used in conjunction with Jest for API endpoint testing.

```bash

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests and generate a coverage report
npm run test:coverage

# Run specific test file (example)
jest tests/unit/services/account.test.js
```

## 🚀 Deployment

### Production Build
For production, the application is typically started using the `start` script:

```bash
npm start
```

This runs the application without development tools like `nodemon`.

### Docker Deployment
The project includes a `Dockerfile` for easy containerization, allowing you to build and run the application in an isolated environment.

1.  **Build the Docker image**
    ```bash
    docker build -t fpbank-backend .
    ```

2.  **Run the Docker container**
    Ensure your `JWT_SECRET` are correctly configured, either in the Dockerfile (not recommended for secrets) or passed as environment variables.
    ```bash
    docker run -p 3000:3000 -e -e JWT_SECRET="<your_prod_jwt_secret>" fpbank-backend
    ```
    For more complex deployments, consider using `docker-compose` to manage the backend container.

## 📚 API Reference

The FPBank Backend exposes a set of RESTful API endpoints, secured with JWT authentication for most operations.

### Authentication
Most API endpoints require a valid JSON Web Token (JWT) in the `Authorization` header, formatted as `Bearer <token>`.

#### `POST /api/auth/register`
Registers a new user account.
- **Body:**
    ```json
    {
        "username": "newuser",
        "email": "user@example.com",
        "password": "strongpassword123"
    }
    ```
- **Response (201 Created):**
    ```json
    {
        "message": "User registered successfully",
        "user": {
            "id": "uuid",
            "username": "newuser",
            "email": "user@example.com"
        }
    }
    ```

#### `POST /api/auth/login`
Authenticates a user and returns a JWT.
- **Body:**
    ```json
    {
        "email": "user@example.com",
        "password": "strongpassword123"
    }
    ```
- **Response (200 OK):**
    ```json
    {
        "message": "Login successful",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": "uuid",
            "username": "newuser",
            "email": "user@example.com"
        }
    }
    ```

### Accounts
All account endpoints require authentication.

#### `GET /api/accounts`
Retrieves all bank accounts associated with the authenticated user.
- **Response (200 OK):**
    ```json
    [
        {
            "id": "account-uuid-1",
            "userId": "user-uuid",
            "accountNumber": "1234567890",
            "accountType": "checking",
            "balance": 1500.75,
            "currency": "USD",
            "createdAt": "2025-01-01T00:00:00Z"
        }
    ]
    ```

#### `POST /api/accounts`
Creates a new bank account for the authenticated user.
- **Body:**
    ```json
    {
        "accountType": "savings",
        "initialDeposit": 100.00
    }
    ```
- **Response (201 Created):**
    ```json
    {
        "message": "Account created successfully",
        "account": {
            "id": "new-account-uuid",
            "userId": "user-uuid",
            "accountNumber": "0987654321",
            "accountType": "savings",
            "balance": 100.00,
            "currency": "USD",
            "createdAt": "2025-01-15T12:30:00Z"
        }
    }
    ```

#### `GET /api/accounts/:id`
Retrieves details of a specific account by ID.
- **Parameters:** `id` (account UUID)
- **Response (200 OK):** (Same as individual account object in `GET /api/accounts` response)

### Transactions
All transaction endpoints require authentication.

#### `POST /api/transactions/deposit`
Deposits funds into a specified account.
- **Body:**
    ```json
    {
        "accountId": "account-uuid-1",
        "amount": 250.50
    }
    ```
- **Response (200 OK):**
    ```json
    {
        "message": "Deposit successful",
        "transaction": {
            "id": "transaction-uuid",
            "accountId": "account-uuid-1",
            "type": "deposit",
            "amount": 250.50,
            "newBalance": 1751.25,
            "timestamp": "2025-02-01T10:00:00Z"
        }
    }
    ```

#### `POST /api/transactions/withdraw`
Withdraws funds from a specified account.
- **Body:**
    ```json
    {
        "accountId": "account-uuid-1",
        "amount": 100.00
    }
    ```
- **Response (200 OK):**
    ```json
    {
        "message": "Withdrawal successful",
        "transaction": {
            "id": "transaction-uuid-2",
            "accountId": "account-uuid-1",
            "type": "withdrawal",
            "amount": 100.00,
            "newBalance": 1651.25,
            "timestamp": "2025-02-01T10:30:00Z"
        }
    }
    ```

#### `POST /api/transactions/transfer`
Transfers funds between two accounts.
- **Body:**
    ```json
    {
        "sourceAccountId": "account-uuid-1",
        "destinationAccountId": "account-uuid-2",
        "amount": 500.00
    }
    ```
- **Response (200 OK):**
    ```json
    {
        "message": "Transfer successful",
        "transaction": {
            "id": "transaction-uuid-3",
            "sourceAccountId": "account-uuid-1",
            "destinationAccountId": "account-uuid-2",
            "type": "transfer",
            "amount": 500.00,
            "sourceNewBalance": 1151.25,
            "destinationNewBalance": 600.00,
            "timestamp": "2025-02-01T11:00:00Z"
        }
    }
    ```

#### `GET /api/transactions`
Retrieves all transactions for the authenticated user across all their accounts.
- **Response (200 OK):**
    ```json
    [
        {
            "id": "transaction-uuid",
            "accountId": "account-uuid-1",
            "type": "deposit",
            "amount": 250.50,
            "newBalance": 1751.25,
            "timestamp": "2025-02-01T10:00:00Z"
        },
        // ... more transactions
    ]
    ```

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [joshperegrin](https://github.com/joshperegrin)

</div>

