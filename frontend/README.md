# Campus Event Management System - Front-End

## Overview
The front-end is developed using modern responsive **HTML5**, **CSS3**, and **JavaScript** (ES6+ modular architecture), delivering a fast, responsive user interface without requiring build-step overhead.

## Team Contributions
- **Student 2 (Front-End Developer 1 - Zoha Khalid)**:
  - Designed responsive Home Page layout, Navigation Bar, Event Listing Grid, and CSS Styling.
  - Branch: `feature/frontend-ui`
- **Student 3 (Front-End Developer 2 - Umme Habiba)**:
  - Developed Event Details Modal, Student Registration Form, Client Form Validation, Real-Time Search, Category Filters, and REST API Integration via `fetch()`.
  - Branch: `feature/frontend-functionality`

## Structure
```
frontend/
├── index.html           # Main Single-Page Application (SPA) dashboard
├── css/
│   └── style.css        # Responsive stylesheet with custom color variables & animations
├── src/
│   ├── api.js           # REST API client wrapper communicating with Express backend
│   ├── auth.js          # Client-side session and JWT token manager
│   └── app.js           # Core state controller, event filtering, and DOM manager
├── components/
│   ├── navbar.js        # Responsive navigation header
│   ├── eventCard.js     # Dynamic event card generator
│   ├── footer.js        # University footer and team credits
│   └── modal.js         # Modal and toast notification system
└── pages/
    ├── events.html
    ├── dashboard.html
    └── login.html
```

## Running the Frontend
The frontend is automatically served by the Express backend at:
```bash
http://localhost:5000/
```
Alternatively, open `frontend/index.html` directly in any web browser or via VS Code Live Server.
