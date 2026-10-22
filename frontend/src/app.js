// Campus Event Management System - Main Frontend Application Logic
// Orchestrates views, search & filtering, event creation, postponements, registrations

let allEvents = [];
let currentCategory = 'All';
let currentSearch = '';
let currentView = 'home';

document.addEventListener('DOMContentLoaded', async () => {
    renderNavbar();
    renderFooter();
    await loadStats();
    await loadEvents();
    setupEventListeners();
});

function setupEventListeners() {
    const searchInput = document.getElementById('eventSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim();
            filterAndDisplayEvents();
        });
    }

    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-category') || 'All';
            filterAndDisplayEvents();
        });
    });
}

async function loadStats() {
    try {
        const stats = await api.getStats();
        if (stats.success) {
            const totalEventsEl = document.getElementById('statTotalEvents');
            const totalRegistrationsEl = document.getElementById('statTotalRegistrations');
            const totalStudentsEl = document.getElementById('statTotalStudents');

            if (totalEventsEl) totalEventsEl.textContent = stats.total_events;
            if (totalRegistrationsEl) totalRegistrationsEl.textContent = stats.total_registrations;
            if (totalStudentsEl) totalStudentsEl.textContent = stats.total_students;
        }
    } catch (err) {
        console.warn('Could not load statistics:', err);
    }
}

async function loadEvents() {
    try {
        const response = await api.getEvents();
        if (response.success && Array.isArray(response.events)) {
            allEvents = response.events;
            filterAndDisplayEvents();
        }
    } catch (err) {
        console.error('Failed to load events:', err);
        const grid = document.getElementById('eventsGrid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: 14px; border: 1px solid var(--border-subtle);">
                    <p style="color: var(--accent-rose); font-weight: 700;">⚠️ Could not connect to API server.</p>
                    <p style="color: var(--slate-600); font-size: 0.9rem; margin-top: 0.5rem;">
                        Make sure server is running with <code>npm start</code> or refresh to load cached catalog.
                    </p>
                </div>
            `;
        }
    }
}

function filterAndDisplayEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    let filtered = allEvents.filter(event => {
        const matchesCategory = currentCategory === 'All' || 
            event.category.toLowerCase() === currentCategory.toLowerCase();

        const query = currentSearch.toLowerCase();
        const matchesSearch = !query || 
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query) ||
            (event.speaker && event.speaker.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
    });

    const countEl = document.getElementById('eventsCount');
    if (countEl) {
        countEl.textContent = `Showing ${filtered.length} of ${allEvents.length} events`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: white; border-radius: 16px; border: 1px solid var(--border-subtle);">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">🔍</div>
                <h3 style="margin-bottom: 0.5rem; font-size: 1.4rem;">No Campus Events Found</h3>
                <p style="color: var(--slate-600); font-size: 0.95rem;">
                    Try clearing your search query or select another category filter.
                </p>
                <button class="btn btn-secondary btn-sm" style="margin-top: 1.25rem;" onclick="resetFilters()">
                    Reset Filters
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(createEventCard).join('');
}

function resetFilters() {
    currentCategory = 'All';
    currentSearch = '';
    const searchInput = document.getElementById('eventSearchInput');
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.category-pill').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-category') === 'All');
    });
    filterAndDisplayEvents();
}

function navigateTo(view) {
    currentView = view;
    renderNavbar();

    const homeSection = document.getElementById('homeSection');
    const eventsSection = document.getElementById('eventsSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const adminSection = document.getElementById('adminSection');

    if (homeSection) homeSection.style.display = view === 'home' ? 'block' : 'none';
    if (eventsSection) eventsSection.style.display = (view === 'home' || view === 'events') ? 'block' : 'none';
    if (dashboardSection) dashboardSection.style.display = view === 'dashboard' ? 'block' : 'none';
    if (adminSection) adminSection.style.display = view === 'admin' ? 'block' : 'none';

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (view === 'home') document.getElementById('navHome')?.classList.add('active');
    if (view === 'events') document.getElementById('navEvents')?.classList.add('active');
    if (view === 'dashboard') {
        document.getElementById('navDashboard')?.classList.add('active');
        loadUserDashboard();
    }
    if (view === 'admin') {
        document.getElementById('navAdmin')?.classList.add('active');
        loadAdminDashboard();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Event Details Modal ---
async function openEventDetailsModal(eventId) {
    try {
        const res = await api.getEventById(eventId);
        if (!res.success || !res.event) return;
        const e = res.event;

        document.getElementById('modalDetailImg').src = e.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
        document.getElementById('modalDetailCategory').textContent = e.category;
        document.getElementById('modalDetailTitle').textContent = e.title;
        document.getElementById('modalDetailDesc').textContent = e.description;
        document.getElementById('modalDetailDate').textContent = `${e.date} (${e.time})`;
        document.getElementById('modalDetailLocation').textContent = e.location;
        document.getElementById('modalDetailSpeaker').textContent = e.speaker || 'Campus Guest';
        document.getElementById('modalDetailOrganizer').textContent = e.organizer || 'Event Committee';
        document.getElementById('modalDetailSeats').textContent = `${e.available_seats} of ${e.capacity} seats remaining`;

        const alertBox = document.getElementById('modalDetailPostponedAlert');
        const alertText = document.getElementById('modalDetailPostponedText');
        if (e.status === 'postponed') {
            alertBox.style.display = 'flex';
            alertText.textContent = `Event Postponed: ${e.postponed_note || `Rescheduled to ${e.date}`}`;
        } else {
            alertBox.style.display = 'none';
        }

        const regBtn = document.getElementById('modalDetailRegisterBtn');
        if (regBtn) {
            if (e.available_seats <= 0) {
                regBtn.disabled = true;
                regBtn.textContent = 'Event Fully Booked';
            } else {
                regBtn.disabled = false;
                regBtn.textContent = 'Register For This Event';
                regBtn.onclick = () => {
                    ui.closeModal('eventDetailsModal');
                    prepareRegistrationModal(e.id);
                };
            }
        }

        ui.openModal('eventDetailsModal');
    } catch (err) {
        ui.showToast(err.message, 'error');
    }
}

// --- Postpone Modal & Functionality ---
function openPostponeModal(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    document.getElementById('postponeEventId').value = event.id;
    document.getElementById('postponeEventTitle').textContent = event.title;
    document.getElementById('postponeNewDate').value = event.date;
    document.getElementById('postponeNewTime').value = event.time;
    document.getElementById('postponeReason').value = `Rescheduled to ${event.date}. All current registrations remain confirmed.`;

    ui.openModal('postponeModal');
}

async function handlePostponeSubmit(e) {
    e.preventDefault();
    const eventId = parseInt(document.getElementById('postponeEventId').value, 10);
    const newDate = document.getElementById('postponeNewDate').value;
    const newTime = document.getElementById('postponeNewTime').value.trim();
    const reason = document.getElementById('postponeReason').value.trim();

    if (!newDate) {
        ui.showToast('Please specify a new date for the event.', 'error');
        return;
    }

    try {
        const res = await api.postponeEvent(eventId, newDate, newTime, reason);
        if (res.success) {
            ui.closeModal('postponeModal');
            ui.showToast(`📢 Event postponed to ${newDate} successfully!`);
            await loadEvents();
            if (currentView === 'admin') {
                await loadAdminDashboard();
            }
        }
    } catch (err) {
        ui.showToast(err.message, 'error');
    }
}

// --- Student Registration Form ---
function prepareRegistrationModal(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    document.getElementById('regEventId').value = event.id;
    document.getElementById('regEventTitleDisplay').textContent = event.title;
    document.getElementById('regEventMetaDisplay').textContent = `Scheduled: ${event.date} • ${event.location}`;

    const user = auth.getUser();
    if (user) {
        document.getElementById('regStudentName').value = user.name;
        document.getElementById('regStudentEmail').value = user.email;
        document.getElementById('regStudentDept').value = user.department || 'Computer Science & IT';
    } else {
        document.getElementById('regStudentName').value = '';
        document.getElementById('regStudentEmail').value = '';
    }

    ui.openModal('registrationModal');
}

async function handleRegistrationSubmit(event) {
    event.preventDefault();

    const eventId = document.getElementById('regEventId').value;
    const name = document.getElementById('regStudentName').value.trim();
    const email = document.getElementById('regStudentEmail').value.trim();
    const rollNo = document.getElementById('regStudentRollNo').value.trim();
    const dept = document.getElementById('regStudentDept').value.trim();
    const notes = document.getElementById('regNotes').value.trim();

    if (!name || !email) {
        ui.showToast('Please provide your full name and university email.', 'error');
        return;
    }

    try {
        const payload = {
            event_id: parseInt(eventId, 10),
            student_name: name,
            student_email: email,
            student_roll_no: rollNo,
            department: dept,
            notes: notes
        };

        const res = await api.registerForEvent(payload);
        if (res.success) {
            ui.closeModal('registrationModal');
            ui.showToast('🎉 Successfully registered! Your seat has been reserved.');
            await loadEvents();
            await loadStats();
        }
    } catch (err) {
        ui.showToast(err.message, 'error');
    }
}

// --- Student Dashboard ("My Registrations") ---
async function loadUserDashboard() {
    const container = document.getElementById('myRegistrationsList');
    if (!container) return;

    const user = auth.getUser();
    if (!user) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3.5rem 1rem;">
                <p style="font-size: 1.1rem; color: var(--slate-700); margin-bottom: 1rem;">
                    Please sign in to access your registered event passes.
                </p>
                <button class="btn btn-primary btn-sm" onclick="openLoginModal()">Sign In Now</button>
            </div>
        `;
        return;
    }

    try {
        const res = await api.getUserRegistrations(user.id);
        const registrations = res.registrations || [];

        if (registrations.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3.5rem 1rem;">
                    <p style="color: var(--slate-600); font-size: 1rem; margin-bottom: 1.25rem;">
                        You have not registered for any events yet.
                    </p>
                    <button class="btn btn-primary btn-sm" onclick="navigateTo('events')">Browse Campus Events</button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Category</th>
                        <th>Date &amp; Venue</th>
                        <th>Booking Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${registrations.map(r => `
                        <tr>
                            <td>
                                <strong>${escapeHtml(r.event_title)}</strong>
                            </td>
                            <td><span class="event-badge ${r.event_category}">${r.event_category}</span></td>
                            <td>${r.event_date} <br><small style="color: var(--slate-400);">${escapeHtml(r.event_location)}</small></td>
                            <td>
                                <span class="badge-status ${r.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}">
                                    ${r.status === 'confirmed' ? '✅ Confirmed Pass' : '❌ Cancelled'}
                                </span>
                            </td>
                            <td>
                                ${r.status === 'confirmed' ? `
                                    <button class="btn btn-danger btn-sm" onclick="cancelRegistrationAction(${r.id})">
                                        Cancel Pass
                                    </button>
                                ` : '<span style="color: var(--slate-400); font-size: 0.85rem;">Booking Void</span>'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        container.innerHTML = `<p style="color: var(--accent-rose);">Failed to load registrations: ${err.message}</p>`;
    }
}

async function cancelRegistrationAction(registrationId) {
    if (!confirm('Are you sure you want to cancel your event registration? Your seat will be released immediately.')) {
        return;
    }

    try {
        const res = await api.cancelRegistration(registrationId);
        if (res.success) {
            ui.showToast('Registration cancelled. Seat returned to pool.');
            await loadUserDashboard();
            await loadEvents();
            await loadStats();
        }
    } catch (err) {
        ui.showToast(err.message, 'error');
    }
}

// --- Admin Panel Dashboard ---
async function loadAdminDashboard() {
    const tableBody = document.getElementById('adminEventsTableBody');
    if (!tableBody) return;

    try {
        const res = await api.getEvents();
        const events = res.events || [];

        tableBody.innerHTML = events.map(e => {
            const isPostponed = e.status === 'postponed';
            return `
                <tr>
                    <td><strong>#${e.id}</strong></td>
                    <td>
                        <strong>${escapeHtml(e.title)}</strong>
                        ${isPostponed ? `<br><small style="color: #b45309; font-weight: 600;">⚠️ ${escapeHtml(e.postponed_note || 'Rescheduled')}</small>` : ''}
                    </td>
                    <td><span class="event-badge ${e.category}">${e.category}</span></td>
                    <td><strong>${e.date}</strong> <br><small style="color: var(--slate-400);">${escapeHtml(e.time)}</small></td>
                    <td>
                        <span class="badge-status ${isPostponed ? 'badge-postponed' : 'badge-upcoming'}">
                            ${isPostponed ? '⏸️ Postponed' : '🟢 Scheduled'}
                        </span>
                    </td>
                    <td>${e.registered_count || (e.capacity - e.available_seats) || 0} / ${e.capacity}</td>
                    <td style="text-align: right;">
                        <div style="display: inline-flex; gap: 0.4rem;">
                            <button class="btn btn-warning btn-sm" onclick="openPostponeModal(${e.id})" title="Postpone or Reschedule Event">
                                ⏸️ Postpone
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="openAttendeesModal(${e.id}, '${escapeHtml(e.title)}')">
                                👥 Attendees
                            </button>
                            <button class="btn btn-outline btn-sm" onclick="openEditEventModal(${e.id})">
                                ✏️ Edit
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteEventAction(${e.id})">
                                🗑️ Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="7" style="color: var(--accent-rose);">Error: ${err.message}</td></tr>`;
    }
}

function openCreateEventModal() {
    document.getElementById('eventFormTitle').textContent = 'Create New Campus Event';
    document.getElementById('eventFormId').value = '';
    document.getElementById('adminEventForm').reset();
    
    // Default today's or future date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('inputEventDate').value = today;
    document.getElementById('inputEventTime').value = '10:00 AM - 02:00 PM';
    document.getElementById('inputEventCapacity').value = '60';

    ui.openModal('adminEventModal');
}

async function openEditEventModal(eventId) {
    try {
        const res = await api.getEventById(eventId);
        if (!res.success || !res.event) return;
        const e = res.event;

        document.getElementById('eventFormTitle').textContent = `Edit Event #${e.id}`;
        document.getElementById('eventFormId').value = e.id;
        document.getElementById('inputEventTitle').value = e.title;
        document.getElementById('inputEventCategory').value = e.category;
        document.getElementById('inputEventDate').value = e.date;
        document.getElementById('inputEventTime').value = e.time;
        document.getElementById('inputEventLocation').value = e.location;
        document.getElementById('inputEventCapacity').value = e.capacity;
        document.getElementById('inputEventSpeaker').value = e.speaker || '';
        document.getElementById('inputEventOrganizer').value = e.organizer || '';
        document.getElementById('inputEventDesc').value = e.description;
        document.getElementById('inputEventImage').value = e.image_url || '';

        ui.openModal('adminEventModal');
    } catch (err) {
        ui.showToast(err.message, 'error');
    }
}

async function handleAdminEventSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('eventFormId').value;
    const payload = {
        title: document.getElementById('inputEventTitle').value.trim(),
        category: document.getElementById('inputEventCategory').value,
        date: document.getElementById('inputEventDate').value,
        time: document.getElementById('inputEventTime').value.trim(),
        location: document.getElementById('inputEventLocation').value.trim(),
        capacity: parseInt(document.getElementById('inputEventCapacity').value, 10),
        speaker: document.getElementById('inputEventSpeaker').value.trim(),
        organizer: document.getElementById('inputEventOrganizer').value.trim(),
        description: document.getElementById('inputEventDesc').value.trim(),
        image_url: document.getElementById('inputEventImage').value.trim()
    };

    try {
        if (id) {
            await api.updateEvent(id, payload);
            ui.showToast('Event updated successfully!');
        } else {
            await api.createEvent(payload);
            ui.showToast('New campus event scheduled successfully!');
        }
        ui.closeModal('adminEventModal');
        await loadEvents();
        await loadStats();
        if (currentView === 'admin') {
            await loadAdminDashboard();
        }
    } catch (err) {
        ui.showToast(err.message, 'error');
    }
}

async function deleteEventAction(eventId) {
    if (!confirm(`Are you sure you want to delete Event #${eventId}? This will remove all associated registrations.`)) {
        return;
    }

    try {
        await api.deleteEvent(eventId);
        ui.showToast(`Event #${eventId} deleted.`);
        await loadEvents();
        await loadStats();
        await loadAdminDashboard();
    } catch (err) {
        ui.showToast(err.message, 'error');
    }
}

async function openAttendeesModal(eventId, eventTitle) {
    document.getElementById('attendeesModalTitle').textContent = `Attendees: ${eventTitle}`;
    const listContainer = document.getElementById('attendeesListContainer');
    listContainer.innerHTML = '<p style="padding: 1rem 0;">Fetching attendee records...</p>';
    ui.openModal('attendeesModal');

    try {
        const res = await api.getEventRegistrations(eventId);
        const registrations = res.registrations || [];

        if (registrations.length === 0) {
            listContainer.innerHTML = '<p style="color: var(--slate-600); padding: 2rem 0; text-align: center;">No students have registered for this event yet.</p>';
            return;
        }

        listContainer.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${registrations.map((r, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td><strong>${escapeHtml(r.user_name)}</strong></td>
                            <td>${escapeHtml(r.user_email)}</td>
                            <td>${escapeHtml(r.user_department || 'Computer Science')}</td>
                            <td>
                                <span class="badge-status ${r.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}">
                                    ${r.status}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        listContainer.innerHTML = `<p style="color: var(--accent-rose);">Failed to fetch attendees: ${err.message}</p>`;
    }
}

// --- Auth Modal & Quick Logins ---
function openLoginModal() {
    document.getElementById('authModalTitle').textContent = 'Sign In to Campus EventHub';
    document.getElementById('signupExtraFields').style.display = 'none';
    document.getElementById('authSubmitBtn').textContent = 'Sign In';
    document.getElementById('authModeSwitchText').innerHTML = `Don't have an account? <a href="#" onclick="openSignupModal(); return false;" style="color: var(--brand-primary); font-weight: 700;">Create one here</a>`;
    document.getElementById('authForm').setAttribute('data-mode', 'login');
    ui.openModal('authModal');
}

function openSignupModal() {
    document.getElementById('authModalTitle').textContent = 'Register New Student Account';
    document.getElementById('signupExtraFields').style.display = 'block';
    document.getElementById('authSubmitBtn').textContent = 'Create Account';
    document.getElementById('authModeSwitchText').innerHTML = `Already have an account? <a href="#" onclick="openLoginModal(); return false;" style="color: var(--brand-primary); font-weight: 700;">Sign In</a>`;
    document.getElementById('authForm').setAttribute('data-mode', 'signup');
    ui.openModal('authModal');
}

async function handleAuthSubmit(event) {
    event.preventDefault();
    const mode = document.getElementById('authForm').getAttribute('data-mode');
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;

    try {
        if (mode === 'signup') {
            const name = document.getElementById('authName').value.trim();
            const department = document.getElementById('authDepartment').value.trim();
            await auth.signup({ name, email, password, department, role: 'student' });
            ui.showToast('Account registered successfully!');
        } else {
            await auth.login(email, password);
            ui.showToast('Signed in successfully!');
        }
        ui.closeModal('authModal');
        renderNavbar();
        await loadEvents();
        await loadStats();
    } catch (err) {
        ui.showToast(err.message, 'error');
    }
}

async function quickDemoLogin(role) {
    try {
        await auth.demoLogin(role);
        ui.closeModal('authModal');
        renderNavbar();
        ui.showToast(`Logged in as ${role.toUpperCase()} user!`);
        await loadEvents();
        await loadStats();
        if (role === 'admin' || role === 'habiba') {
            navigateTo('admin');
        }
    } catch (err) {
        ui.showToast(err.message, 'error');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
