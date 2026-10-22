// Navigation Bar Component

function renderNavbar() {
    const navContainer = document.getElementById('navbarContainer');
    if (!navContainer) return;

    const user = auth.getUser();
    const isAdmin = auth.isAdmin();

    navContainer.innerHTML = `
        <nav class="navbar">
            <div class="container nav-container">
                <div class="nav-brand" onclick="navigateTo('home')">
                    <span style="font-size: 1.5rem;">🏛️</span>
                    <div>
                        <span>UOL EventHub</span>
                        <span class="brand-badge">Campus Portal</span>
                    </div>
                </div>

                <ul class="nav-links">
                    <li><a class="nav-link active" id="navHome" onclick="navigateTo('home')">Home</a></li>
                    <li><a class="nav-link" id="navEvents" onclick="navigateTo('events')">Browse Events</a></li>
                    ${user ? `<li><a class="nav-link" id="navDashboard" onclick="navigateTo('dashboard')">My Registrations</a></li>` : ''}
                    ${isAdmin ? `<li><a class="nav-link" id="navAdmin" onclick="navigateTo('admin')">Admin Panel</a></li>` : ''}
                </ul>

                <div class="nav-actions">
                    ${user ? `
                        <div class="user-menu">
                            <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                            <div class="user-info">
                                <strong>${user.name}</strong>
                                <span class="user-role-badge">${user.role}</span>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="auth.logout()">Sign Out</button>
                    ` : `
                        <button class="btn btn-secondary btn-sm" onclick="openLoginModal()">Login</button>
                        <button class="btn btn-primary btn-sm" onclick="openSignupModal()">Register</button>
                    `}
                </div>
            </div>
        </nav>
    `;
}

window.renderNavbar = renderNavbar;
