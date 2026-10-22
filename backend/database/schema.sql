-- Campus Event Management System
-- Database Schema for SQLite

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student', -- 'student' or 'admin'
    department TEXT DEFAULT 'Computer Science',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,          -- Format: YYYY-MM-DD
    time TEXT NOT NULL,          -- Format: HH:MM
    location TEXT NOT NULL,
    category TEXT NOT NULL,      -- 'Seminar', 'Workshop', 'Sports', 'Competition', 'Conference', 'Society Activities'
    capacity INTEGER NOT NULL DEFAULT 50,
    available_seats INTEGER NOT NULL DEFAULT 50,
    speaker TEXT DEFAULT 'University Guest',
    organizer TEXT DEFAULT 'Campus Event Committee',
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'postponed', 'completed', 'cancelled'
    postponed_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'confirmed', -- 'confirmed' or 'cancelled'
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE(user_id, event_id)
);
