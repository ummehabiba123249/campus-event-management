# Database Schema & Design

The application utilizes **SQLite** for relational data persistence.

## Entity Relationship Diagram (ERD)

```
 +------------------------+             +--------------------------+
 |         USERS          |             |          EVENTS          |
 +------------------------+             +--------------------------+
 | id (PK, INTEGER)       |             | id (PK, INTEGER)         |
 | name (TEXT)            |             | title (TEXT)             |
 | email (TEXT, UNIQUE)   |<---+   +--->| description (TEXT)       |
 | password (TEXT)        |    |   |    | date (TEXT)              |
 | role (TEXT)            |    |   |    | time (TEXT)              |
 | department (TEXT)      |    |   |    | location (TEXT)          |
 | created_at (DATETIME)  |    |   |    | category (TEXT)          |
 +------------------------+    |   |    | capacity (INTEGER)       |
                               |   |    | available_seats (INTEGER)|
                               |   |    | speaker (TEXT)           |
            1:N                |   |    | organizer (TEXT)         |
                               |   |    | image_url (TEXT)         |
                               |   |    | created_at (DATETIME)    |
                               |   |    +--------------------------+
                  +------------+---+-------------+
                  |        REGISTRATIONS         |
                  +------------------------------+
                  | id (PK, INTEGER)             |
                  | user_id (FK -> users.id)     |
                  | event_id (FK -> events.id)   |
                  | registration_date (DATETIME) |
                  | status (TEXT)                |
                  | notes (TEXT)                 |
                  +------------------------------+
```

## Table Definitions

### 1. `users` Table
Stores student and administrator credentials and department details.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique user identifier |
| `name` | TEXT | NOT NULL | Full name of student/admin |
| `email` | TEXT | UNIQUE, NOT NULL | University email address |
| `password` | TEXT | NOT NULL | Bcrypt hashed password |
| `role` | TEXT | NOT NULL, DEFAULT 'student' | Access role: `student` or `admin` |
| `department` | TEXT | DEFAULT 'Computer Science' | Academic department |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp when registered |

### 2. `events` Table
Stores university seminars, workshops, sports, competitions, conferences, and society activities.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique event identifier |
| `title` | TEXT | NOT NULL | Event headline |
| `description` | TEXT | NOT NULL | Detailed event description |
| `date` | TEXT | NOT NULL | Event date (YYYY-MM-DD) |
| `time` | TEXT | NOT NULL | Scheduled hours |
| `location` | TEXT | NOT NULL | Venue / hall / sports ground |
| `category` | TEXT | NOT NULL | 'Seminar', 'Workshop', 'Sports', etc. |
| `capacity` | INTEGER | NOT NULL, DEFAULT 50 | Total seats available |
| `available_seats`| INTEGER | NOT NULL | Remaining seats count |
| `speaker` | TEXT | DEFAULT 'Guest Speaker' | Presenter / Keynote name |
| `organizer` | TEXT | DEFAULT 'Event Committee'| Organizing department/society |
| `image_url` | TEXT | NULL | Cover image URL |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

### 3. `registrations` Table
Tracks registrations connecting students to events.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Registration record ID |
| `user_id` | INTEGER | NOT NULL, FOREIGN KEY | References `users(id)` |
| `event_id` | INTEGER | NOT NULL, FOREIGN KEY | References `events(id)` |
| `registration_date`| DATETIME | DEFAULT CURRENT_TIMESTAMP | Registration timestamp |
| `status` | TEXT | DEFAULT 'confirmed' | 'confirmed' or 'cancelled' |
| `notes` | TEXT | NULL | Special student requests / roll number |

## Integrity Constraints
- Foreign keys enforced with `PRAGMA foreign_keys = ON;`.
- Deleting an event or user cascades (`ON DELETE CASCADE`).
- Composite unique constraint `UNIQUE(user_id, event_id)` prevents accidental duplicate active registrations.
