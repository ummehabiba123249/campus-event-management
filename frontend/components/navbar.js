// Navigation Bar Component - Refined and Modernized

function renderNavbar() {
    const navContainer = document.getElementById('navbarContainer');
    if (!navContainer) return;

    const user = auth.getUser();
    const isAdmin = auth.isAdmin();

    navContainer.innerHTML = `
        <nav class="navbar">
            <div class="container nav-container">
                <div class="nav-brand" onclick="navigateTo('home')">
                    <div class="brand-icon">🏛️</div>
                    <div class="brand-text">
                        <span class="brand-name">UOL EventHub</span>
                        <span class="brand-sub">Campus Management System</span>
                    </div>
                </div>

                <ul class="nav-links">
                    <li><a class="nav-link active" id="navHome" onclick="navigateTo('home')">🏠 Home</a></li>
                    <li><a class="nav-link" id="navEvents" onclick="navigateTo('events')">📅 All Events</a></li>
                    ${user ? `<li><a class="nav-link" id="navDashboard" onclick="navigateTo('dashboard')">🎟️ My Passes</a></li>` : ''}
                    ${isAdmin ? `<li><a class="nav-link" id="navAdmin" onclick="navigateTo('admin')" style="color: var(--brand-primary); font-weight: 700;">🛡️ Admin Control</a></li>` : ''}
                </ul>

                <div class="nav-actions">
                    ${user ? `
                        <div class="user-menu">
                            <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                            <div class="user-info">
                                <span class="user-name">${user.name}</span>
                                <span class="user-role-badge">${user.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}</span>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="auth.logout()">Sign Out</button>
                    ` : `
                        <button class="btn btn-secondary btn-sm" onclick="openLoginModal()">Sign In</button>
                        <button class="btn btn-primary btn-sm" onclick="openSignupModal()">Register</button>
                    `}
                </div>
            </div>
        </nav>
    `;
}

window.renderNavbar = renderNavbar;
