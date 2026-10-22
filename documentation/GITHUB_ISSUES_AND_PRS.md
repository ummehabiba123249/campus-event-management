# GitHub Issues & Pull Requests Log

Use this file as a reference when submitting or presenting GitHub issues and pull requests to the instructor.

---

## 1. GitHub Issues

### Issue #1: Database Schema & Connection Setup
- **Assignee**: Laiba Aamir (Student 5 - Database & Testing)
- **Labels**: `Database`, `Backend`
- **Description**:
  ```markdown
  ### Description
  Set up SQLite database connection and create relational tables for Users, Events, and Registrations.
  
  ### Acceptance Criteria
  - [x] Create SQLite database file and initialization wrapper
  - [x] Define tables: `users`, `events`, and `registrations`
  - [x] Add seed data with demo users and realistic campus events
  - [x] Verify foreign keys and cascade delete support
  ```

### Issue #2: Develop REST APIs for Events, Auth, and Registrations
- **Assignee**: Laiba Aamir (Student 4 - Back-End Developer 1)
- **Labels**: `Backend`, `API`
- **Description**:
  ```markdown
  ### Description
  Build Express REST endpoints for event management, student registration, and user authentication.
  
  ### Acceptance Criteria
  - [x] `GET /api/events` with search & category filtering
  - [x] `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`
  - [x] `POST /api/register` with seat decrement and duplicate protection
  - [x] `POST /api/login` and `POST /api/signup` with JWT tokens
  - [x] Automated test script passing all test cases
  ```

### Issue #3: Build Responsive Front-End UI & Event Cards
- **Assignee**: Zoha Khalid (Student 2 - Front-End Developer 1)
- **Labels**: `Frontend`, `UI`
- **Description**:
  ```markdown
  ### Description
  Create the core UI layout, responsive navigation header, hero banner, event cards grid, and footer.
  
  ### Acceptance Criteria
  - [x] Responsive navigation bar with mobile support
  - [x] Hero section with university branding and statistics strip
  - [x] Dynamic event card component showing dates, location, category badges, and seat counters
  - [x] CSS stylesheet with modern variables, transitions, and accessible typography
  ```

### Issue #4: Implement Interactive Functionality, Search, Filter & API Integration
- **Assignee**: Umme Habiba (Student 3 - Front-End Developer 2)
- **Labels**: `Frontend`, `API Integration`
- **Description**:
  ```markdown
  ### Description
  Connect the front-end user interface to the Express REST APIs.
  
  ### Acceptance Criteria
  - [x] Real-time event search input listener
  - [x] Interactive category filter pills
  - [x] Event Details Modal with complete speaker and venue info
  - [x] Student Registration modal form with client validation
  - [x] Student dashboard showing registered events with cancellation option
  - [x] Admin event creation and management portal
  ```

### Issue #5: Integrate Front-End with Back-End & Deployment Setup
- **Assignee**: Umme Habiba (Student 1 - Team Lead)
- **Labels**: `Documentation`, `Integration`
- **Description**:
  ```markdown
  ### Description
  Coordinate pull request reviews, resolve any merge conflicts, configure Express static serving for front-end assets, and prepare full project documentation.
  
  ### Acceptance Criteria
  - [x] Express serves front-end assets at root URL
  - [x] Review and merge all feature branches into main
  - [x] Create comprehensive README, API docs, and architecture diagrams
  - [x] Provide Postman collection and automated test suites
  ```

---

## 2. Pull Request Descriptions & Code Review Comments

### PR #1: Feature - Database Schema and Seeding (`feature/database-testing` ➔ `main`)
- **Author**: Laiba Aamir
- **Reviewer**: Umme Habiba
- **Review Comment**:
  > *"Excellent work on the SQLite database wrapper and schema. The schema enforces proper foreign key constraints, and the initial seed script populates diverse campus events with accurate seat capacities. Approved for merge."*

### PR #2: Feature - Express REST APIs and Automated Testing (`feature/backend-api` ➔ `main`)
- **Author**: Laiba Aamir
- **Reviewer**: Umme Habiba
- **Review Comment**:
  > *"All required endpoints (`/api/events`, `/api/register`, `/api/login`, `/api/signup`) are tested and functional. Automated tests cover all 37 test cases including duplicate registration prevention and seat decrementing. Approved."*

### PR #3: Feature - Responsive UI Layout & Event Cards (`feature/frontend-ui` ➔ `main`)
- **Author**: Zoha Khalid
- **Reviewer**: Umme Habiba
- **Review Comment**:
  > *"Clean, modern styling matching university brand guidelines. Responsive layout adapts well to mobile and desktop screen sizes. Approved."*

### PR #4: Feature - Interactive Client Logic & API Integration (`feature/frontend-functionality` ➔ `main`)
- **Author**: Umme Habiba
- **Reviewer**: Zoha Khalid, Laiba Aamir
- **Review Comment**:
  > *"Search and category filters update instantaneously. The registration form pre-fills student info and provides instant feedback. Verified end-to-end integration."*
