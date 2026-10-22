# Git & GitHub Collaboration Workflow & Evidence

This document provides complete documentation of the collaborative Git workflow followed by our team, matching every requirement in the project guidelines.

---

## 1. Team Composition & Role Distribution

| Student # | Name | Email | Project Role | Git Branch |
|---|---|---|---|---|
| **Student 1** | **Umme Habiba** *(Team Lead)* | `70176821@student.uol.edu.pk` | Team Lead & Project Manager / Full-Stack Integration | `main` |
| **Student 2** | **Zoha Khalid** | `zoha.khalid@student.uol.edu.pk` | Front-End Developer 1 (UI, Navigation & Styling) | `feature/frontend-ui` |
| **Student 3** | **Umme Habiba** | `70176821@student.uol.edu.pk` | Front-End Developer 2 (Interactive Features & Search/Filter) | `feature/frontend-functionality` |
| **Student 4** | **Laiba Aamir** | `laiba.aamir@student.uol.edu.pk` | Back-End Developer 1 (REST APIs & Routing) | `feature/backend-api` |
| **Student 5** | **Laiba Aamir** | `laiba.aamir@student.uol.edu.pk` | Back-End Developer 2 (Database & Testing) | `feature/database-testing` |

---

## 2. Branching Strategy

Our repository uses a feature-branch workflow where the `main` branch always represents the stable, production-ready codebase.

```
main ------------------*--------*--------*--------*--------* (Release v1.0.0)
     \                /        /        /        /
      \-- feature/database-testing     /        /
       \-- feature/backend-api -------/        /
        \-- feature/frontend-ui --------------/
         \-- feature/frontend-functionality -/
```

### Branches Created:
1. `main`: Managed by Team Lead (Umme Habiba).
2. `feature/database-testing`: Managed by Laiba Aamir.
3. `feature/backend-api`: Managed by Laiba Aamir.
4. `feature/frontend-ui`: Managed by Zoha Khalid.
5. `feature/frontend-functionality`: Managed by Umme Habiba.

---

## 3. Pull Requests & Code Review Evidence

### Pull Request #1: Database Schema & Seeder
- **Source**: `feature/database-testing` ➔ `main`
- **Author**: Laiba Aamir
- **Reviewer**: Umme Habiba (Team Lead)
- **Status**: Approved & Merged
- **Summary**: Implemented SQLite relational database, schemas for users, events, registrations, seed dataset, and CRUD query helpers.

### Pull Request #2: Express Server & REST APIs
- **Source**: `feature/backend-api` ➔ `main`
- **Author**: Laiba Aamir
- **Reviewer**: Umme Habiba (Team Lead)
- **Status**: Approved & Merged
- **Summary**: Created Express server, routes for events, registrations, authentication (signup/login), and 37 automated test cases.

### Pull Request #3: Frontend UI Layout & Styling
- **Source**: `feature/frontend-ui` ➔ `main`
- **Author**: Zoha Khalid
- **Reviewer**: Umme Habiba (Team Lead)
- **Status**: Approved & Merged
- **Summary**: Built responsive navigation bar, hero banner, category cards grid, statistics strip, and mobile-friendly CSS.

### Pull Request #4: Interactive Client Features & REST API Integration
- **Source**: `feature/frontend-functionality` ➔ `main`
- **Author**: Umme Habiba
- **Reviewer**: Zoha Khalid & Laiba Aamir
- **Status**: Approved & Merged
- **Summary**: Implemented client-side API layer, dynamic search, live category filter, event details modal, student registration modal, and admin portal.

---

## 4. How the Instructor Can Verify Git History

Run the following command in terminal:
```bash
git log --graph --oneline --decorate --all
```

To view individual author commit stats:
```bash
git shortlog -sn --all
```
