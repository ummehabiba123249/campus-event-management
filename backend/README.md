# Campus Event Management System - Back-End

## Overview
The back-end is built with **Node.js** and **Express.js**, backed by an embedded **SQLite** relational database with JWT authentication and Role-Based Access Control (RBAC).

## Team Contributions
- **Student 4 (Back-End Developer 1 - Laiba Aamir)**:
  - Developed Express REST API routing and controllers for Events CRUD, Student Registration, and User Authentication.
  - Branch: `feature/backend-api`
- **Student 5 (Back-End Developer 2 / Database & Testing - Laiba Aamir)**:
  - Designed SQLite relational schema, seed scripts, CRUD queries, error handling, input validation, and automated API tests.
  - Branch: `feature/database-testing`
- **Student 1 (Team Lead & Full-Stack Integrator - Umme Habiba)**:
  - Repository setup, backend-to-frontend middleware integration, CORS configuration, and CI/CD pipelines.
  - Branch: `main`

## Architecture & Structure
```
backend/
├── server.js              # Express application entry point, CORS, static serving & error handlers
├── package.json           # Backend dependency manifest
├── database/
│   ├── db.js              # SQLite connection pool and query helpers
│   ├── schema.sql         # Database schema (Users, Events, Registrations)
│   ├── seed.js            # Sample data seeder
│   └── campus_events.db   # SQLite database file
├── models/
│   ├── userModel.js       # User database operations
│   ├── eventModel.js      # Event database operations & seat counter
│   └── registrationModel.js # Registration database operations
├── controllers/
│   ├── authController.js  # Signup, login, profile logic
│   ├── eventController.js # Event listing, search, create, update, delete
│   └── registrationController.js # Event registration and cancellation logic
├── routes/
│   ├── authRoutes.js      # /api/auth routes
│   ├── eventRoutes.js     # /api/events routes
│   └── registrationRoutes.js # /api/registrations routes
├── middleware/
│   └── authMiddleware.js  # JWT token verification & RBAC
└── tests/
    └── api.test.js        # Automated API test suite (37 tests)
```

## Running the Server
```bash
# From the project root or backend folder:
npm install
npm start
```
Server starts on `http://localhost:5000`.

## Running Automated Tests
```bash
npm test
```
All 37 test cases run against a local server instance and verify database inserts, updates, queries, and deletions.
