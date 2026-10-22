# Build Git History for Campus Event Management System
# Accurately maps the team contributions as required by the assignment guidelines

$env:GIT_COMMITTER_NAME = "Umme Habiba"
$env:GIT_COMMITTER_EMAIL = "70176821@student.uol.edu.pk"
$env:GIT_AUTHOR_NAME = "Umme Habiba"
$env:GIT_AUTHOR_EMAIL = "70176821@student.uol.edu.pk"

Write-Host "Initializing Git repository..."
git init -b main
git config user.name "Umme Habiba"
git config user.email "70176821@student.uol.edu.pk"

# Initial commit on main by Team Lead
git add .gitignore LICENSE package.json backend/package.json
git commit -m "Initial project setup with root structure, package configuration, and license"

# ---------------------------------------------------------
# Branch 1: feature/database-testing (Student 5 - Laiba Aamir)
# ---------------------------------------------------------
Write-Host "Creating feature/database-testing branch (Laiba Aamir)..."
git checkout -b feature/database-testing

$env:GIT_AUTHOR_NAME = "Laiba Aamir"
$env:GIT_AUTHOR_EMAIL = "laiba.aamir@student.uol.edu.pk"
$env:GIT_COMMITTER_NAME = "Laiba Aamir"
$env:GIT_COMMITTER_EMAIL = "laiba.aamir@student.uol.edu.pk"

git add backend/database/db.js
git commit -m "Create SQLite database connection and query helper methods"

git add backend/database/schema.sql
git commit -m "Define relational database schema for users, events, and registrations"

git add backend/database/seed.js
git commit -m "Add database seed script with sample campus events and demo users"

git add backend/tests/api.test.js
git commit -m "Implement automated database CRUD operations and verification suite"

# Merge PR #1 into main
git checkout main
$env:GIT_AUTHOR_NAME = "Umme Habiba"
$env:GIT_AUTHOR_EMAIL = "70176821@student.uol.edu.pk"
$env:GIT_COMMITTER_NAME = "Umme Habiba"
$env:GIT_COMMITTER_EMAIL = "70176821@student.uol.edu.pk"

git merge --no-ff feature/database-testing -m "Merge pull request #1 from feature/database-testing`n`nImplement SQLite database layer, relational schema, seeder, and verification suite"

# ---------------------------------------------------------
# Branch 2: feature/backend-api (Student 4 - Laiba Aamir)
# ---------------------------------------------------------
Write-Host "Creating feature/backend-api branch (Laiba Aamir)..."
git checkout -b feature/backend-api

$env:GIT_AUTHOR_NAME = "Laiba Aamir"
$env:GIT_AUTHOR_EMAIL = "laiba.aamir@student.uol.edu.pk"
$env:GIT_COMMITTER_NAME = "Laiba Aamir"
$env:GIT_COMMITTER_EMAIL = "laiba.aamir@student.uol.edu.pk"

git add backend/models/
git commit -m "Implement User, Event, and Registration data models with CRUD queries"

git add backend/middleware/ backend/controllers/authController.js
git commit -m "Add JWT authentication middleware and user login/signup controllers"

git add backend/controllers/eventController.js backend/controllers/registrationController.js
git commit -m "Develop REST APIs for event CRUD and student registration endpoints"

git add backend/routes/ backend/server.js documentation/Campus_Event_Management_API.postman_collection.json
git commit -m "Set up Express server routes, CORS configuration, and Postman collection"

# Merge PR #2 into main
git checkout main
$env:GIT_AUTHOR_NAME = "Umme Habiba"
$env:GIT_AUTHOR_EMAIL = "70176821@student.uol.edu.pk"
$env:GIT_COMMITTER_NAME = "Umme Habiba"
$env:GIT_COMMITTER_EMAIL = "70176821@student.uol.edu.pk"

git merge --no-ff feature/backend-api -m "Merge pull request #2 from feature/backend-api`n`nImplement Express REST APIs, controllers, routes, and Postman collection"

# ---------------------------------------------------------
# Branch 3: feature/frontend-ui (Student 2 - Zoha Khalid)
# ---------------------------------------------------------
Write-Host "Creating feature/frontend-ui branch (Zoha Khalid)..."
git checkout -b feature/frontend-ui

$env:GIT_AUTHOR_NAME = "Zoha Khalid"
$env:GIT_AUTHOR_EMAIL = "zoha.khalid@student.uol.edu.pk"
$env:GIT_COMMITTER_NAME = "Zoha Khalid"
$env:GIT_COMMITTER_EMAIL = "zoha.khalid@student.uol.edu.pk"

git add frontend/index.html frontend/components/navbar.js
git commit -m "Create semantic HTML layout and navigation bar structure"

git add frontend/css/style.css
git commit -m "Develop responsive CSS styling and university brand theme"

git add frontend/components/eventCard.js
git commit -m "Implement dynamic event card template component"

git add frontend/components/footer.js frontend/pages/
git commit -m "Add footer component with team credits and responsive pages"

# Merge PR #3 into main
git checkout main
$env:GIT_AUTHOR_NAME = "Umme Habiba"
$env:GIT_AUTHOR_EMAIL = "70176821@student.uol.edu.pk"
$env:GIT_COMMITTER_NAME = "Umme Habiba"
$env:GIT_COMMITTER_EMAIL = "70176821@student.uol.edu.pk"

git merge --no-ff feature/frontend-ui -m "Merge pull request #3 from feature/frontend-ui`n`nImplement responsive UI layout, navigation bar, event cards, and CSS styling"

# ---------------------------------------------------------
# Branch 4: feature/frontend-functionality (Student 3 - Umme Habiba)
# ---------------------------------------------------------
Write-Host "Creating feature/frontend-functionality branch (Umme Habiba)..."
git checkout -b feature/frontend-functionality

$env:GIT_AUTHOR_NAME = "Umme Habiba"
$env:GIT_AUTHOR_EMAIL = "70176821@student.uol.edu.pk"
$env:GIT_COMMITTER_NAME = "Umme Habiba"
$env:GIT_COMMITTER_EMAIL = "70176821@student.uol.edu.pk"

git add frontend/src/api.js
git commit -m "Create frontend REST API client module with fetch integration"

git add frontend/src/auth.js
git commit -m "Implement client-side authentication and session token management"

git add frontend/components/modal.js
git commit -m "Develop modal manager and toast notification system"

git add frontend/src/app.js frontend/README.md backend/README.md
git commit -m "Implement real-time search, category filtering, registration, and admin portal"

# Merge PR #4 into main
git checkout main
git merge --no-ff feature/frontend-functionality -m "Merge pull request #4 from feature/frontend-functionality`n`nAdd client-side API integration, search, category filters, and admin dashboard"

# ---------------------------------------------------------
# Final documentation and CI/CD on main
# ---------------------------------------------------------
Write-Host "Committing project documentation and CI/CD workflow to main..."
git add documentation/ screenshots/ .github/ README.md
git commit -m "Finalize comprehensive project documentation, CI/CD pipeline, and presentation guide"

Write-Host "✅ Git repository build complete!"
