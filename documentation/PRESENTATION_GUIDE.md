# Final Presentation Guide (5–10 Minutes)

This guide provides the presentation script and demo flow for each member during the final viva/demonstration as required by Sections 22 & 26 of the project guidelines.

---

## 1. Team Lead: Umme Habiba (2 Minutes)
### Topics to Cover:
- **Project Purpose**: Centralized Campus Event Management System allowing UOL students to view, search, and register for university workshops, sports galas, and seminars.
- **Git & GitHub Architecture**:
  - Show GitHub repository structure: `frontend/`, `backend/`, `documentation/`.
  - Explain Branch Strategy: `main` branch protected, 4 dedicated feature branches:
    - `feature/frontend-ui`
    - `feature/frontend-functionality`
    - `feature/backend-api`
    - `feature/database-testing`
  - Showcase GitHub Issues, Pull Request reviews, and merge commits.
  - Team coordination and milestone achievements.

---

## 2. Front-End Developer 1: Zoha Khalid (1.5 Minutes)
### Topics to Cover:
- **UI & Layout Design**:
  - University of Lahore branding, color palette (Teal, Navy, Amber), responsive grid layout.
  - Sticky Navigation bar with dynamic state (Guest vs Authenticated Student vs Admin).
  - Statistics strip (Total Events, Active Students, Confirmed Registrations).
  - Event Cards design displaying category badges, dates, venues, and live capacity progress bars.
  - Responsive behavior across mobile and desktop devices.

---

## 3. Front-End Developer 2: Umme Habiba (1.5 Minutes)
### Topics to Cover:
- **Client-Side Functionality & API Integration**:
  - Live search bar filtering events instantly by title or keyword.
  - Category pill filters (Seminars, Workshops, Sports, Competitions, Conferences, Society Activities).
  - Interactive Event Details modal.
  - Student Registration form with client-side validation and immediate feedback.
  - Student Dashboard ("My Registrations") allowing students to track their confirmed passes and cancel bookings.
  - API integration via asynchronous `fetch()` requests to `http://localhost:5000/api/*`.

---

## 4. Back-End Developer 1: Laiba Aamir (1.5 Minutes)
### Topics to Cover:
- **Express Server & RESTful APIs**:
  - Node.js and Express server setup with CORS, JSON parsing, and error-handling middleware.
  - Complete REST API implementation:
    - Events CRUD: `GET /api/events`, `GET /api/events/:id`, `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`.
    - Registrations: `POST /api/register`, `GET /api/registrations`, `DELETE /api/registrations/:id`.
    - Authentication: `POST /api/login`, `POST /api/signup` with JWT tokens.
  - Demonstration of Postman testing using the exported collection `Campus_Event_Management_API.postman_collection.json`.

---

## 5. Back-End Developer 2 / Database & Testing: Laiba Aamir (1.5 Minutes)
### Topics to Cover:
- **Database Architecture & Testing**:
  - SQLite database design: `users`, `events`, and `registrations` tables with foreign keys and cascade rules.
  - Available seats calculation logic and duplicate registration prevention.
  - Database seeding with realistic campus data and bcrypt-hashed passwords.
  - Automated test suite execution:
    ```bash
    npm test
    ```
    Demonstrate that all 37 test cases pass with 0 failures, verifying Insert, Select, Update, and Delete operations.

---

## 6. Live Application Walkthrough (1–2 Minutes)
1. Team Lead starts the server with `npm start`.
2. Open `http://localhost:5000` in Google Chrome.
3. Search for "AI Workshop" and filter by "Sports".
4. Click "1-Click Demo Login" as Umme Habiba.
5. Register for an event and verify the seat counter decrements.
6. Navigate to "My Registrations" to see the active booking.
7. Switch to Admin Panel, create a new event, and view the attendee roster.
