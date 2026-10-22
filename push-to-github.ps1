# Script to connect and push this repository to GitHub
# Account: 70176821@student.uol.edu.pk (Umme Habiba)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Campus Event Management System - GitHub Push Helper" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Account: 70176821@student.uol.edu.pk" -ForegroundColor Yellow
Write-Host ""

$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/your-username/campus-event-management.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "No URL entered. If you have GitHub CLI authenticated, you can also run:" -ForegroundColor Yellow
    Write-Host "  gh repo create campus-event-management --public --source=. --remote=origin --push" -ForegroundColor White
    exit
}

# Check if origin exists
$existingOrigin = git remote get-url origin 2>$null
if ($existingOrigin) {
    git remote set-url origin $repoUrl
} else {
    git remote add origin $repoUrl
}

Write-Host "`nPushing main branch to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "`nPushing all feature branches to GitHub..." -ForegroundColor Green
git push origin --all

Write-Host "`nAll branches (main, feature/frontend-ui, feature/frontend-functionality, feature/backend-api, feature/database-testing) pushed successfully!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
