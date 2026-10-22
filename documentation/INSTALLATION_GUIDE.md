# Installation & Deployment Guide

This guide details how to clone, install, configure, test, and run the Campus Event Management System.

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested and recommended)
- **npm**: v9.0.0 or higher
- **Git**: Installed and configured
- **Google Chrome** or any modern web browser

---

## 2. Local Setup & Execution

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd campus-event-management
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Database Seed (Optional - auto-seeds on first launch)
```bash
npm run seed
```

### Step 4: Run Automated Tests
Verify all API endpoints and database operations:
```bash
npm test
```
*Expected Result: 37 Passed, 0 Failed.*

### Step 5: Start Server
```bash
npm start
```
The server will start on:
```
http://localhost:5000
```
Open this URL in Google Chrome to access the complete application!

---

## 3. Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Team Lead / Admin** | `70176821@student.uol.edu.pk` | `student123` | Full Admin + Student |
| **Front-End Developer** | `zoha.khalid@student.uol.edu.pk` | `student123` | Student Access |
| **Back-End Developer** | `laiba.aamir@student.uol.edu.pk` | `student123` | Student Access |
| **Campus Admin** | `admin@uol.edu.pk` | `admin123` | Full Admin Access |

*Note: You can also use the convenient "1-Click Fast Login" buttons inside the sign-in modal to switch between user roles instantly.*
