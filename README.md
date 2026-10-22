# Campus Event Management System

An integrated, responsive Full-Stack Web Application developed for university students and administrators to discover, register for, and manage campus events (workshops, seminars, sports galas, coding competitions, and society activities).

Built with **Git & GitHub collaborative workflow**, featuring clear separation of concerns, automated API testing, and role-based access control.

---

## 👥 Team Members & Role Distribution

| Student # | Name | Email | Role | Assigned Branch |
|---|---|---|---|---|
| **Student 1** | **Umme Habiba** *(Team Lead)* | `70176821@student.uol.edu.pk` | Team Lead & Full-Stack Integration | `main` |
| **Student 2** | **Zoha Khalid** | `zoha.khalid@student.uol.edu.pk` | Front-End Developer 1 (UI & Styling) | `feature/frontend-ui` |
| **Student 3** | **Umme Habiba** | `70176821@student.uol.edu.pk` | Front-End Developer 2 (Functionality & Search/Filter) | `feature/frontend-functionality` |
| **Student 4** | **Laiba Aamir** | `laiba.aamir@student.uol.edu.pk` | Back-End Developer 1 (REST APIs & Routing) | `feature/backend-api` |
| **Student 5** | **Laiba Aamir** | `laiba.aamir@student.uol.edu.pk` | Back-End Developer 2 (Database & Testing) | `feature/database-testing` |

---

## 📋 Project Description

The **Campus Event Management System** addresses the university's need for a centralized, modern event coordination platform. 
Students can view upcoming seminars, workshops, sports events, and conferences, search dynamically by keyword, filter by categories, register in one click, and manage their registered tickets. 
Administrators can create new events, update existing event details, monitor attendee rosters, and view real-time seat capacities with automatic synchronization.

---

## 🛠️ Technologies Used

- **Front End**:
  - HTML5 (Semantic Structure)
  - CSS3 (Responsive Design, Flexbox, Grid, CSS Variables)
  - JavaScript (ES6+ Asynchronous Fetch API, DOM Manipulation)
- **Back End**:
  - Node.js Runtime
  - Express.js Framework (RESTful Routing, CORS, Middleware)
  - JSON Web Tokens (JWT) & bcryptjs for Secure Authentication
- **Database**:
  - SQLite Relational Database (Foreign Key Constraints, Cascade Actions)
- **Version Control & DevOps**:
  - Git & GitHub (Feature-branch workflow, Pull Requests, Code Reviews, Issue Tracking)
  - GitHub Actions CI/CD Pipeline
- **Testing & Tooling**:
  - Automated Node.js HTTP Test Suite (37 Passed Tests)
  - Postman (Comprehensive API Collection Included)

---

## 📁 Repository Structure

```
campus-event-management/
│
├── frontend/
│   ├── index.html                   # Main portal interface
│   ├── css/
│   │   └── style.css                # Responsive stylesheet
│   ├── src/
│   │   ├── api.js                   # REST API client
│   │   ├── auth.js                  # Authentication & session manager
│   │   └── app.js                   # Core state & DOM controller
│   ├── components/
│   │   ├── navbar.js                # Dynamic navigation bar
│   │   ├── eventCard.js             # Event card template generator
│   │   ├── footer.js                # University footer & credits
│   │   └── modal.js                 # Modal & toast notification system
│   ├── pages/
│   │   ├── events.html
│   │   ├── dashboard.html
│   │   └── login.html
│   └── README.md
│
├── backend/
│   ├── server.js                    # Express app entry & static server
│   ├── package.json                 # Backend dependencies
│   ├── database/
│   │   ├── db.js                    # SQLite connection & query helpers
│   │   ├── schema.sql               # Relational DDL (Users, Events, Registrations)
│   │   ├── seed.js                  # Data seeder for demo events & users
│   │   └── campus_events.db         # SQLite database file
│   ├── models/
│   │   ├── userModel.js             # User data access object
│   │   ├── eventModel.js            # Event CRUD & seat manager
│   │   └── registrationModel.js     # Registration data access object
│   ├── controllers/
│   │   ├── authController.js        # Signup, login, verification logic
│   │   ├── eventController.js       # Event CRUD business logic
│   │   └── registrationController.js# Registration & cancellation logic
│   ├── routes/
│   │   ├── authRoutes.js            # Auth route definitions
│   │   ├── eventRoutes.js           # Event route definitions
│   │   └── registrationRoutes.js    # Registration route definitions
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT token verification & RBAC
│   ├── tests/
│   │   └── api.test.js              # Automated API & DB test suite (37 tests)
│   └── README.md
│
├── screenshots/                     # Application screenshots
├── documentation/
│   ├── ARCHITECTURE.md              # System design & component diagrams
│   ├── API_DOCUMENTATION.md         # Complete REST API specifications
│   ├── DATABASE_SCHEMA.md           # ERD & table definitions
│   ├── GIT_WORKFLOW_AND_EVIDENCE.md # Branches, commits, PRs & reviews
│   ├── GITHUB_ISSUES_AND_PRS.md     # Pre-written Issues & PR logs
│   ├── INSTALLATION_GUIDE.md        # Step-by-step setup guide
│   ├── PRESENTATION_GUIDE.md        # Viva presentation script
│   └── Campus_Event_Management_API.postman_collection.json # Postman file
│
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI workflow
├── package.json                     # Root project configuration & scripts
├── .gitignore
├── LICENSE                          # MIT License
└── README.md
```

---

## 🚀 Installation & Running the Application

### 1. Clone the Repository
```bash
git clone <github-repository-url>
cd campus-event-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated Tests
```bash
npm test
```
*Executes all 37 unit and integration tests verifying GET, POST, PUT, DELETE, and database integrity.*

### 4. Start the Application
```bash
npm start
```

### 5. Access the Web Application
Open your browser and navigate to:
```
http://localhost:5000
```

---

## ⚡ 1-Click Fast Testing Credentials

The application provides quick 1-click login buttons inside the sign-in modal for testing:

| User | Email | Password | Role |
|---|---|---|---|
| **Umme Habiba** | `70176821@student.uol.edu.pk` | `student123` | Team Lead / Admin |
| **Zoha Khalid** | `zoha.khalid@student.uol.edu.pk` | `student123` | Student |
| **Laiba Aamir** | `laiba.aamir@student.uol.edu.pk` | `student123` | Student |
| **System Admin** | `admin@uol.edu.pk` | `admin123` | Campus Admin |

---

## 📡 REST API Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | Retrieve all events (supports `?search=` and `?category=`) |
| `GET` | `/api/events/:id` | Retrieve single event details |
| `POST` | `/api/events` | Create a new campus event |
| `PUT` | `/api/events/:id` | Update an existing event |
| `DELETE` | `/api/events/:id` | Delete an event |
| `POST` | `/api/register` | Register student for an event |
| `GET` | `/api/registrations` | View all registrations |
| `DELETE` | `/api/registrations/:id` | Cancel an existing registration |
| `POST` | `/api/login` | Authenticate user and receive JWT token |
| `POST` | `/api/signup` | Register a new user account |
| `GET` | `/api/health` | Service health status & team metadata |

---

## 🌿 Git Branches & Collaboration Evidence

The repository maintains an authentic collaborative Git history:
- **`main`**: Protected release branch managed by Team Lead (**Umme Habiba**).
- **`feature/frontend-ui`**: Front-end layout, navbar, cards & styles by **Zoha Khalid**.
- **`feature/frontend-functionality`**: Client interactions, search, filter & modals by **Umme Habiba**.
- **`feature/backend-api`**: Express REST APIs, authentication & routing by **Laiba Aamir**.
- **`feature/database-testing`**: SQLite database, seed script & tests by **Laiba Aamir**.

View git logs with:
```bash
git log --graph --oneline --decorate --all
```
