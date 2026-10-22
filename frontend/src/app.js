// Campus Event Management System - Terra Organic Full-Stack Application Logic
// Orchestrates views, live REST APIs, LocalDB fallback, turnstile passes, postpone, admin controls

let allEvents = [];
let userRegistrations = [];
let currentCategory = 'All';
let currentSearch = '';
let currentView = 'events';
let activeAuthMode = 'signin';

// App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    initAuthSession();
    await loadEvents();
    await loadStats();
    setupSearchListener();
});

// Setup Real-Time Search
function setupSearchListener() {
    const searchInput = document.getElementById('eventSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim().toLowerCase();
            renderEventsGrid();
        });
    }

    const adminSearchInput = document.getElementById('adminTableSearchInput');
    if (adminSearchInput) {
        adminSearchInput.addEventListener('input', () => {
            filterAdminTable();
        });
    }
}

// Fetch Events from Backend API or Local Fallback
async function loadEvents() {
    try {
        const res = await api.getEvents();
        if (res && res.success && Array.isArray(res.events)) {
            allEvents = res.events;
            renderEventsGrid();
            updateSpotlightCard();
            if (currentView === 'admin-dashboard') {
                renderAdminTable();
            }
        }
    } catch (err) {
        console.error('Failed to load events:', err);
    }
}

// Fetch Statistics
async function loadStats() {
    try {
        const stats = await api.getStats();
        if (stats && stats.success) {
            const evEl = document.getElementById('statTotalEvents');
            const stEl = document.getElementById('statTotalStudents');
            const regEl = document.getElementById('statTotalRegistrations');
            if (evEl) evEl.textContent = stats.total_events || allEvents.length;
            if (stEl) stEl.textContent = stats.total_students || 5;
            if (regEl) regEl.textContent = stats.total_registrations || 8;
        }
    } catch (e) {}
}

// Navigation Handler (SPA routing)
function navigateTo(view) {
    currentView = view;
    const viewEvents = document.getElementById('viewEvents');
    const viewStudent = document.getElementById('viewStudentPortal');
    const viewAdmin = document.getElementById('viewAdminCenter');

    if (viewEvents) viewEvents.style.display = view === 'events' ? 'flex' : 'none';
    if (viewStudent) viewStudent.style.display = view === 'student-passes' ? 'flex' : 'none';
    if (viewAdmin) viewAdmin.style.display = view === 'admin-dashboard' ? 'flex' : 'none';

    // Update Nav Tab Styles
    const tabEvents = document.getElementById('tabEvents');
    const tabStudent = document.getElementById('tabStudent');
    const tabAdmin = document.getElementById('tabAdmin');

    const activeClasses = ['bg-primary-container', 'text-on-primary-container', 'font-semibold', 'shadow-sm'];
    const inactiveClasses = ['text-on-surface-variant', 'hover:bg-surface-container', 'hover:text-on-surface', 'font-medium'];

    [tabEvents, tabStudent, tabAdmin].forEach(t => {
        if (t) {
            t.classList.remove(...activeClasses);
            t.classList.add(...inactiveClasses);
        }
    });

    if (view === 'events' && tabEvents) {
        tabEvents.classList.remove(...inactiveClasses);
        tabEvents.classList.add(...activeClasses);
    } else if (view === 'student-passes' && tabStudent) {
        tabStudent.classList.remove(...inactiveClasses);
        tabStudent.classList.add(...activeClasses);
        loadUserDashboard();
    } else if (view === 'admin-dashboard' && tabAdmin) {
        tabAdmin.classList.remove(...inactiveClasses);
        tabAdmin.classList.add(...activeClasses);
        loadAdminDashboard();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Category Filter Controller
function setCategoryFilter(category, btnElement) {
    currentCategory = category;
    document.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-xs', 'font-semibold');
        btn.classList.add('bg-surface', 'text-on-surface-variant', 'font-medium');
    });

    if (btnElement) {
        btnElement.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-xs', 'font-semibold');
        btnElement.classList.remove('bg-surface', 'text-on-surface-variant', 'font-medium');
    }

    renderEventsGrid();
}

// Render Event Cards Grid (Terra Organic Design)
function renderEventsGrid() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    let filtered = allEvents.filter(event => {
        const matchesCategory = currentCategory === 'All' || 
            event.category.toLowerCase().includes(currentCategory.toLowerCase());

        const q = currentSearch;
        const matchesSearch = !q || 
            event.title.toLowerCase().includes(q) ||
            (event.description && event.description.toLowerCase().includes(q)) ||
            (event.location && event.location.toLowerCase().includes(q)) ||
            (event.speaker && event.speaker.toLowerCase().includes(q)) ||
            (event.organizer && event.organizer.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
    });

    const countText = document.getElementById('eventsCountText');
    if (countText) {
        countText.textContent = `Showing ${filtered.length} campus events matching current filters`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 px-4 text-center bg-surface-container-low rounded-3xl border border-outline-variant/30">
                <span class="material-symbols-outlined text-5xl text-tertiary">search_off</span>
                <h3 class="font-headline text-xl font-bold text-on-surface mt-2">No Matching Campus Events</h3>
                <p class="text-xs text-on-surface-variant mt-1">Try relaxing your search keywords or select 'All Categories'.</p>
                <button class="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary" onclick="setCategoryFilter('All', document.querySelector('[data-category=All]'))">
                    Show All Events
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(createEventCardHTML).join('');
}

// Generate Event Card HTML
function createEventCardHTML(event) {
    const isPostponed = event.status === 'postponed';
    const isWaitlist = event.status === 'waitlist' || event.available_seats <= 0;
    const capacityPct = Math.min(100, Math.round(((event.capacity - event.available_seats) / event.capacity) * 100));
    const isAdmin = window.auth && window.auth.isAdmin();

    // Visual styles for category badge
    let catBg = "bg-primary text-on-primary";
    if (event.category === 'Sports') catBg = "bg-tertiary-container text-on-tertiary-container font-bold";
    if (event.category === 'Conferences') catBg = "bg-tertiary-fixed text-on-tertiary-fixed font-bold";
    if (event.category === 'Competitions') catBg = "bg-tertiary-fixed-dim text-on-tertiary-fixed font-bold";
    if (event.category === 'Seminars') catBg = "bg-secondary-fixed text-on-secondary-fixed font-bold";

    return `
        <div class="bg-surface-container-low rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-outline-variant/20" data-event-id="${event.id}">
            <div>
                <!-- Card Image & Badge -->
                <div class="relative h-48 rounded-2xl overflow-hidden mb-4 bg-surface-container">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                         src="${event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}" 
                         alt="${escapeHtml(event.title)}"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent"></div>
                    
                    <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${catBg}">
                            ${event.category}
                        </span>
                        ${isPostponed ? `
                            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-error-container text-on-error-container">
                                ⏸️ Postponed
                            </span>
                        ` : (isWaitlist ? `
                            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">
                                Waitlist Active
                            </span>
                        ` : `
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-fixed/80 text-on-primary-fixed">
                                Confirmed
                            </span>
                        `)}
                    </div>

                    <div class="absolute bottom-3 left-3 right-3 text-inverse-on-surface">
                        <span class="text-[10px] uppercase font-bold tracking-wider text-primary-fixed block">${escapeHtml(event.organizer || 'Campus Life')}</span>
                        <h3 class="font-headline text-base sm:text-lg font-bold leading-snug text-white">${escapeHtml(event.title)}</h3>
                    </div>
                </div>

                <!-- Postponement Notice (If postponed) -->
                ${isPostponed ? `
                    <div class="mb-3 p-2.5 rounded-xl bg-error-container/30 border border-error-container text-on-error-container text-xs flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm text-error">event_repeat</span>
                        <div>
                            <strong>Rescheduled:</strong> ${escapeHtml(event.postponed_note || `New Date: ${event.date}`)}
                        </div>
                    </div>
                ` : ''}

                <!-- Event Details Metadata -->
                <div class="space-y-1.5 text-xs text-on-surface-variant font-label mb-4">
                    <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm text-primary">person</span>
                        <span class="font-semibold text-on-surface">${escapeHtml(event.speaker || 'Campus Faculty')}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm text-tertiary">calendar_clock</span>
                        <span>${event.date} • ${escapeHtml(event.time)}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm text-primary">location_on</span>
                        <span>${escapeHtml(event.location)}</span>
                    </div>
                </div>

                <!-- Description -->
                <p class="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                    ${escapeHtml(event.description)}
                </p>
            </div>

            <!-- Footer: Capacity & CTAs -->
            <div class="pt-3 border-t border-outline-variant/30 space-y-3">
                <div class="space-y-1">
                    <div class="flex justify-between items-center text-[11px] font-label">
                        <span class="text-on-surface-variant font-semibold">Capacity Status</span>
                        <span class="font-bold ${isWaitlist ? 'text-tertiary' : 'text-primary'}">
                            ${event.capacity - event.available_seats} / ${event.capacity} Filled (${capacityPct}%)
                        </span>
                    </div>
                    <div class="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                        <div class="h-full rounded-full ${isWaitlist ? 'bg-tertiary' : 'bg-primary'}" style="width: ${capacityPct}%"></div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2">
                    <button class="flex-1 py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors" onclick="openEventDetailsModal(${event.id})">
                        View Details
                    </button>
                    <button class="flex-1 py-2 px-3 rounded-xl ${isWaitlist ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-primary text-on-primary'} text-xs font-semibold shadow-xs hover:opacity-95 transition-all" onclick="openClaimPassModal(${event.id})">
                        ${isWaitlist ? 'Join Standby Waitlist' : 'Register Now'}
                    </button>
                </div>

                ${isAdmin ? `
                    <div class="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                        <span class="text-[10px] uppercase font-bold text-tertiary">Admin Tools:</span>
                        <div class="flex items-center gap-1">
                            <button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface" onclick="openEditModalFromCard(${event.id})" title="Edit">
                                <span class="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button class="p-1.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed" onclick="openPostponeModalFromCard(${event.id})" title="Postpone">
                                <span class="material-symbols-outlined text-sm">event_repeat</span>
                            </button>
                            <button class="p-1.5 rounded-lg bg-error-container text-on-error-container" onclick="confirmArchive(${event.id})" title="Delete">
                                <span class="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Update Spotlight Card on Hero
function updateSpotlightCard() {
    if (allEvents.length === 0) return;
    const spot = allEvents[0];
    const imgEl = document.getElementById('spotlightImg');
    const titleEl = document.getElementById('spotlightTitle');
    const deptEl = document.getElementById('spotlightDept');
    const venueEl = document.getElementById('spotlightVenue');
    const schedEl = document.getElementById('spotlightSchedule');
    const speakerEl = document.getElementById('spotlightSpeaker');
    const seatsEl = document.getElementById('spotlightSeatsRatio');
    const barEl = document.getElementById('spotlightBar');

    if (imgEl && spot.image_url) imgEl.src = spot.image_url;
    if (titleEl) titleEl.textContent = spot.title;
    if (deptEl) deptEl.textContent = spot.organizer || 'Faculty of IT';
    if (venueEl) venueEl.textContent = spot.location;
    if (schedEl) schedEl.textContent = `${spot.date} • ${spot.time}`;
    if (speakerEl) speakerEl.textContent = `Keynote: ${spot.speaker || 'Campus Faculty'}`;
    
    const pct = Math.min(100, Math.round(((spot.capacity - spot.available_seats) / spot.capacity) * 100));
    if (seatsEl) seatsEl.textContent = `${spot.capacity - spot.available_seats} / ${spot.capacity} Filled (${pct}%)`;
    if (barEl) barEl.style.width = `${pct}%`;
}

function claimSpotlightPass() {
    if (allEvents.length > 0) {
        openClaimPassModal(allEvents[0].id);
    }
}

function openSpotlightModal() {
    if (allEvents.length > 0) {
        openEventDetailsModal(allEvents[0].id);
    }
}

// Event Details Modal
async function openEventDetailsModal(id) {
    const event = allEvents.find(e => e.id === id);
    if (!event) return;
    openClaimPassModal(event.id);
}

// --- Claim Student Entry Pass Modal ---
function openClaimPassModal(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    document.getElementById('claimEventId').value = event.id;
    document.getElementById('claimModalEventTitle').textContent = `${event.title} (${event.date})`;

    const user = auth.getUser();
    if (user) {
        document.getElementById('claimStudentName').value = user.name;
        document.getElementById('claimStudentEmail').value = user.email;
        document.getElementById('claimStudentDept').value = user.department || 'Department of Software Engineering';
        document.getElementById('claimStudentRoll').value = user.roll_no || 'UOL-F23-SE-0412';
    } else {
        document.getElementById('claimStudentName').value = 'Zoha Khalid';
        document.getElementById('claimStudentEmail').value = 'zoha.khalid@student.uol.edu.pk';
        document.getElementById('claimStudentDept').value = 'Department of Software Engineering';
        document.getElementById('claimStudentRoll').value = 'UOL-F23-SE-0412';
    }

    openModal('claimPassModal');
}

async function handleClaimPassSubmit(e) {
    e.preventDefault();
    const eventId = parseInt(document.getElementById('claimEventId').value, 10);
    const name = document.getElementById('claimStudentName').value.trim();
    const email = document.getElementById('claimStudentEmail').value.trim();
    const roll = document.getElementById('claimStudentRoll').value.trim();
    const dept = document.getElementById('claimStudentDept').value.trim();

    try {
        const payload = {
            event_id: eventId,
            student_name: name,
            student_email: email,
            student_roll_no: roll,
            department: dept
        };
        const res = await api.registerForEvent(payload);
        if (res.success) {
            closeModal('claimPassModal');
            showToast('🎉 Digital Turnstile Pass confirmed! View in Student Portal.');
            await loadEvents();
            await loadStats();
            navigateTo('student-passes');
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// --- STUDENT PORTAL CONTROLLER (Image 2) ---
async function loadUserDashboard() {
    const container = document.getElementById('studentPassesCardsGrid');
    const tableBody = document.getElementById('studentRosterTableBody');
    const regCount = document.getElementById('statStudentRegCount');
    const heroCount = document.getElementById('heroPassesCount');

    const user = auth.getUser() || { id: 1, name: 'Zoha Khalid', email: 'zoha.khalid@student.uol.edu.pk', department: 'Department of Software Engineering' };
    
    // Update Profile Header
    const nameEl = document.getElementById('studentPortalName');
    const deptEl = document.getElementById('studentPortalDept');
    if (nameEl) nameEl.textContent = user.name;
    if (deptEl) deptEl.textContent = `${user.department || 'Department of Software Engineering'} • Faculty of Information Technology • Semester 5 (Section A)`;

    try {
        const res = await api.getUserRegistrations(user.id);
        const registrations = (res && res.registrations) ? res.registrations : [];
        userRegistrations = registrations;

        if (regCount) regCount.textContent = `${registrations.length < 10 ? '0' + registrations.length : registrations.length} Events`;
        if (heroCount) heroCount.textContent = `Check My Passes (${registrations.length})`;

        // Render Digital Turnstile Passes (NFC Cards with QR & Barcodes)
        if (container) {
            if (registrations.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full py-12 text-center bg-surface-container-low rounded-3xl">
                        <p class="text-on-surface-variant text-sm">No active passes yet. Browse events to claim your fast-track turnstile pass.</p>
                        <button class="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary" onclick="navigateTo('events')">Browse Events</button>
                    </div>
                `;
            } else {
                container.innerHTML = registrations.slice(0, 3).map((r, i) => createNfcPassCardHTML(r, i)).join('');
            }
        }

        // Render Roster & History Table
        if (tableBody) {
            tableBody.innerHTML = registrations.map(r => `
                <tr class="hover:bg-surface-container/50 transition-colors">
                    <td class="py-3.5 px-3">
                        <div class="font-bold text-sm text-on-surface">${escapeHtml(r.event_title)}</div>
                        <div class="text-[11px] text-on-surface-variant">Gate Access Verified</div>
                    </td>
                    <td class="py-3.5 px-3">
                        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary-fixed text-on-primary-fixed">
                            ${escapeHtml(r.event_category || 'Academic')}
                        </span>
                    </td>
                    <td class="py-3.5 px-3 font-semibold text-primary">#UOL-EVT-${r.event_id || r.id}</td>
                    <td class="py-3.5 px-3">${r.event_date || '2026-11-15'}</td>
                    <td class="py-3.5 px-3 text-on-surface-variant">${escapeHtml(r.event_location || 'Campus Auditorium')}</td>
                    <td class="py-3.5 px-3">
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${r.status === 'confirmed' ? 'bg-primary/10 text-primary' : 'bg-error-container text-on-error-container'}">
                            <span class="w-1.5 h-1.5 rounded-full ${r.status === 'confirmed' ? 'bg-primary' : 'bg-error'}"></span>
                            ${r.status === 'confirmed' ? 'Confirmed (Pass Active)' : 'Cancelled'}
                        </span>
                    </td>
                    <td class="py-3.5 px-3 text-right">
                        ${r.status === 'confirmed' ? `
                            <button class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-error-container text-on-error-container hover:opacity-90" onclick="cancelStudentPassAction(${r.id})">
                                Cancel
                            </button>
                        ` : '<span class="text-outline">Void</span>'}
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.warn('Dashboard load error:', e);
    }
}

// Generate Turnstile NFC Pass Card HTML (Matches Image 2)
function createNfcPassCardHTML(reg, index) {
    const cardThemes = [
        { headerBg: 'bg-[#4a7c59]', text: 'text-white', badge: 'WORKSHOPS & AI LAB', passBadge: 'Verified Pass', bannerBg: 'bg-primary/15' },
        { headerBg: 'bg-[#5b8c6a]', text: 'text-white', badge: 'SPORTS & ATHLETICS', passBadge: 'Confirmed Athlete', bannerBg: 'bg-tertiary-container/20' },
        { headerBg: 'bg-[#705c30]', text: 'text-white', badge: 'FAST-TRACK GOLD ACCESS', passBadge: 'Gate B VIP Line', bannerBg: 'bg-tertiary/15' }
    ];
    const theme = cardThemes[index % cardThemes.length];

    return `
        <div class="bg-surface-container-low rounded-3xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
                <!-- Card Header Banner -->
                <div class="${theme.headerBg} p-4 rounded-2xl ${theme.text} mb-4 flex flex-col justify-between h-28 relative overflow-hidden">
                    <div class="flex items-center justify-between text-[11px] font-bold">
                        <span class="uppercase tracking-wider opacity-90">${theme.badge}</span>
                        <span class="bg-surface/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px]">${theme.passBadge}</span>
                    </div>
                    <div>
                        <h4 class="font-headline text-base font-bold leading-tight">${escapeHtml(reg.event_title)}</h4>
                        <span class="text-[11px] opacity-80 mt-0.5 block"># Ticket ID: #UOL-EVT-${reg.event_id || reg.id}</span>
                    </div>
                </div>

                <!-- Pass Details -->
                <div class="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div class="p-2.5 rounded-xl bg-surface">
                        <span class="text-[10px] text-on-surface-variant uppercase font-semibold">VENUE</span>
                        <div class="font-bold text-on-surface mt-0.5">${escapeHtml(reg.event_location || 'CS Auditorium Block 4')}</div>
                    </div>
                    <div class="p-2.5 rounded-xl bg-surface">
                        <span class="text-[10px] text-on-surface-variant uppercase font-semibold">SEAT NUMBER</span>
                        <div class="font-bold text-primary mt-0.5">Seat A-${(index * 7) + 24} (General)</div>
                    </div>
                </div>

                <!-- Date & NFC Tag -->
                <div class="flex items-center justify-between text-xs text-on-surface-variant font-label py-2 border-y border-outline-variant/30 mb-4">
                    <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm text-tertiary">calendar_today</span>
                        <span>${reg.event_date || 'Oct 18, 2026 • 10:00 AM'}</span>
                    </div>
                    <span class="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">NFC READY</span>
                </div>

                <!-- Barcode / QR Simulation -->
                <div class="p-3 rounded-2xl bg-surface flex flex-col items-center justify-center text-center mb-4">
                    <img class="w-24 h-24 object-contain" src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=UOL-PASS-${reg.id}" alt="Turnstile QR Pass"/>
                    <span class="text-[9px] uppercase tracking-widest text-on-surface-variant mt-1.5 font-bold">SCAN AT BLOCK 4 GATES</span>
                </div>
            </div>

            <!-- Card Actions -->
            <div class="flex items-center gap-2">
                <button class="flex-1 py-2 px-3 rounded-xl bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-1 shadow-xs" onclick="downloadPassPdf('${escapeHtml(reg.event_title)}')">
                    <span class="material-symbols-outlined text-sm">download</span>
                    <span>Pass PDF</span>
                </button>
                <button class="py-2 px-3 rounded-xl bg-surface-container hover:bg-error-container hover:text-on-error-container text-xs font-semibold text-on-surface transition-colors" onclick="cancelStudentPassAction(${reg.id})">
                    Cancel
                </button>
            </div>
        </div>
    `;
}

async function cancelStudentPassAction(regId) {
    if (!confirm('Are you sure you want to cancel this student pass? Your seat reservation will be refunded to the campus pool.')) return;
    try {
        const res = await api.cancelRegistration(regId);
        if (res.success) {
            showToast('Pass cancelled. Seat returned to campus registry.');
            await loadUserDashboard();
            await loadEvents();
            await loadStats();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function downloadPassPdf(title) {
    showToast(`📄 Generating Digital PDF Pass for: ${title}`);
}

function downloadAllPassesZip() {
    showToast('📦 Bundled all 3 active NFC digital passes into a downloadable archive.');
}

function downloadCertificate(name) {
    showToast(`🎓 Verified Certificate for ${name} downloaded.`);
}

function filterPassRoster(filter, btn) {
    btn.parentElement.querySelectorAll('button').forEach(b => {
        b.className = 'px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface';
    });
    btn.className = 'px-3 py-1.5 rounded-lg bg-surface text-on-surface shadow-xs font-semibold';
    loadUserDashboard();
}

// --- ADMIN CONTROL CENTER CONTROLLER (Image 3) ---
async function loadAdminDashboard() {
    renderAdminTable();
}

function renderAdminTable() {
    const tableBody = document.getElementById('adminEventsTableBody');
    const totalBadge = document.getElementById('adminTableTotalBadge');
    if (!tableBody) return;

    if (totalBadge) totalBadge.textContent = `Total: ${allEvents.length} Active Records`;

    tableBody.innerHTML = allEvents.map(e => {
        const isPostponed = e.status === 'postponed';
        const isWaitlist = e.status === 'waitlist' || e.available_seats <= 0;
        const capacityPct = Math.min(100, Math.round(((e.capacity - e.available_seats) / e.capacity) * 100));

        return `
            <tr class="hover:bg-surface-container/50 transition-colors ${isPostponed ? 'bg-error-container/15' : ''}" data-category="${e.category}" data-status="${e.status}">
                <td class="py-3.5 px-4 font-semibold font-label text-primary">#EV-${e.id}</td>
                <td class="py-3.5 px-4">
                    <div class="font-bold text-sm text-on-surface">${escapeHtml(e.title)}</div>
                    <div class="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span class="material-symbols-outlined text-[13px] text-tertiary">person</span>
                        Keynote: ${escapeHtml(e.speaker || 'Campus Lead')} • ${escapeHtml(e.organizer || 'Guild')}
                    </div>
                </td>
                <td class="py-3.5 px-3">
                    <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                        ${e.category}
                    </span>
                </td>
                <td class="py-3.5 px-4">
                    ${isPostponed ? `
                        <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold">
                            <span class="material-symbols-outlined text-[13px]">warning</span>
                            ${escapeHtml(e.postponed_note || `Rescheduled: ${e.date}`)}
                        </div>
                        <div class="text-[11px] text-on-surface-variant mt-0.5">${escapeHtml(e.location)}</div>
                    ` : `
                        <div class="font-medium">${e.date} • ${escapeHtml(e.time)}</div>
                        <div class="text-[11px] text-on-surface-variant">${escapeHtml(e.location)}</div>
                    `}
                </td>
                <td class="py-3.5 px-3">
                    ${isPostponed ? `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-error/10 text-error">
                            <span class="w-1.5 h-1.5 rounded-full bg-error"></span>
                            Postponed
                        </span>
                    ` : (isWaitlist ? `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                            <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                            Waitlist Only
                        </span>
                    ` : `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
                            <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            Confirmed
                        </span>
                    `)}
                </td>
                <td class="py-3.5 px-4">
                    <div class="flex justify-between items-center text-[11px] mb-1">
                        <span class="font-semibold text-on-surface">${e.capacity - e.available_seats} / ${e.capacity}</span>
                        <span class="text-on-surface-variant">${capacityPct}%</span>
                    </div>
                    <div class="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                        <div class="h-full rounded-full ${isPostponed ? 'bg-error' : (isWaitlist ? 'bg-tertiary' : 'bg-primary')}" style="width: ${capacityPct}%"></div>
                    </div>
                </td>
                <td class="py-3.5 px-4 text-right">
                    <div class="inline-flex items-center gap-1">
                        <button class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" onclick="openEditModalFromCard(${e.id})" title="Edit Event Parameters">
                            <span class="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" onclick="openRosterModal(${e.id})" title="View Attendees">
                            <span class="material-symbols-outlined text-base">group</span>
                        </button>
                        <button class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-tertiary transition-colors" onclick="openPostponeModalFromCard(${e.id})" title="Reschedule / Postpone">
                            <span class="material-symbols-outlined text-base">event_repeat</span>
                        </button>
                        <button class="p-1.5 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" onclick="confirmArchive(${e.id})" title="Delete / Archive">
                            <span class="material-symbols-outlined text-base">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterAdminTable() {
    const q = (document.getElementById('adminTableSearchInput')?.value || '').toLowerCase();
    const statusF = document.getElementById('adminStatusFilterSelect')?.value || 'ALL';
    const catF = document.getElementById('adminCategoryFilterSelect')?.value || 'ALL';

    const rows = document.querySelectorAll('#adminEventsTableBody tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        const cat = row.getAttribute('data-category') || '';
        const status = row.getAttribute('data-status') || '';

        const matchesQ = !q || text.includes(q);
        const matchesStatus = statusF === 'ALL' || status === statusF;
        const matchesCat = catF === 'ALL' || cat.toLowerCase().includes(catF.toLowerCase());

        row.style.display = (matchesQ && matchesStatus && matchesCat) ? '' : 'none';
    });
}

function resetAdminFilters() {
    const s = document.getElementById('adminTableSearchInput');
    const st = document.getElementById('adminStatusFilterSelect');
    const c = document.getElementById('adminCategoryFilterSelect');
    if (s) s.value = '';
    if (st) st.value = 'ALL';
    if (c) c.value = 'ALL';
    filterAdminTable();
}

// --- ADMIN CRUD ACTIONS ---

// 1. Create Event
function openCreateEventModal() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('createEventDate').value = today;
    document.getElementById('createEventTime').value = '10:00 AM - 02:00 PM';
    openModal('createEventModal');
}

async function handleAdminCreateSubmit(e) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('createEventTitle').value.trim(),
        category: document.getElementById('createEventCategory').value,
        capacity: parseInt(document.getElementById('createEventCapacity').value, 10),
        date: document.getElementById('createEventDate').value,
        time: document.getElementById('createEventTime').value.trim(),
        location: document.getElementById('createEventLocation').value.trim(),
        speaker: document.getElementById('createEventSpeaker').value.trim() || 'Dr. Tariq Mahmood',
        organizer: document.getElementById('createEventOrganizer').value.trim() || 'UOL Student Affairs',
        image_url: document.getElementById('createEventImage').value.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        description: document.getElementById('createEventDesc').value.trim()
    };

    try {
        const res = await api.createEvent(payload);
        if (res.success) {
            closeModal('createEventModal');
            showToast('✨ Event published to university registry successfully!');
            await loadEvents();
            await loadStats();
            if (currentView === 'admin-dashboard') {
                renderAdminTable();
            }
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// 2. Postpone Event
function openPostponeModalFromCard(id) {
    const event = allEvents.find(e => e.id === id);
    if (!event) return;

    document.getElementById('postponeEventId').value = event.id;
    document.getElementById('postponeEventLabel').textContent = `Adjusting #EV-${event.id}: ${event.title}`;
    document.getElementById('postponeNewDate').value = event.date;
    document.getElementById('postponeNewTime').value = event.time;
    document.getElementById('postponeBroadcastNotice').value = `Rescheduled to ${event.date}. All current student passes remain valid.`;

    openModal('postponeModal');
}

async function handlePostponeSubmit(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('postponeEventId').value, 10);
    const newDate = document.getElementById('postponeNewDate').value;
    const newTime = document.getElementById('postponeNewTime').value.trim();
    const reason = document.getElementById('postponeReasonSelect').value;
    const notice = document.getElementById('postponeBroadcastNotice').value.trim() || reason;

    try {
        const res = await api.postponeEvent(id, newDate, newTime, `${reason} - ${notice}`);
        if (res.success) {
            closeModal('postponeModal');
            showToast(`📢 Event #${id} postponed to ${newDate} with broadcast sent!`);
            await loadEvents();
            if (currentView === 'admin-dashboard') {
                renderAdminTable();
            }
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// 3. Edit Event
function openEditModalFromCard(id) {
    const event = allEvents.find(e => e.id === id);
    if (!event) return;

    document.getElementById('editEventId').value = event.id;
    document.getElementById('editEventIdLabel').textContent = `Editing #EV-${event.id}`;
    document.getElementById('editTitleInput').value = event.title;
    document.getElementById('editCategoryInput').value = event.category;
    document.getElementById('editCapInput').value = event.capacity;
    document.getElementById('editScheduleInput').value = `${event.date} • ${event.time}`;

    openModal('editEventModal');
}

async function handleEditSubmit(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editEventId').value, 10);
    const title = document.getElementById('editTitleInput').value.trim();
    const category = document.getElementById('editCategoryInput').value.trim();
    const capacity = parseInt(document.getElementById('editCapInput').value, 10);
    const schedule = document.getElementById('editScheduleInput').value.trim();

    try {
        const res = await api.updateEvent(id, { title, category, capacity, time: schedule });
        if (res.success) {
            closeModal('editEventModal');
            showToast('Parameters updated successfully!');
            await loadEvents();
            if (currentView === 'admin-dashboard') {
                renderAdminTable();
            }
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// 4. Delete / Archive Event
async function confirmArchive(id) {
    if (!confirm(`Are you sure you want to remove Event #EV-${id}? This will cancel all registered student turnstile passes.`)) return;

    try {
        const res = await api.deleteEvent(id);
        if (res.success) {
            showToast(`Event #EV-${id} archived from campus registry.`);
            await loadEvents();
            await loadStats();
            if (currentView === 'admin-dashboard') {
                renderAdminTable();
            }
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// 5. Attendee Roster Modal
async function openRosterModal(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    document.getElementById('rosterEventTitle').textContent = `#EV-${event.id} • ${event.title}`;
    const list = document.getElementById('rosterListContainer');
    list.innerHTML = '<p class="text-xs text-on-surface-variant p-4">Syncing turnstile scanner stream...</p>';
    openModal('rosterModal');

    try {
        const res = await api.getEventRegistrations(eventId);
        const registrations = (res && res.registrations) ? res.registrations : [];

        const totalEl = document.getElementById('rosterTotalCount');
        const checkedEl = document.getElementById('rosterCheckedInCount');
        const awaitEl = document.getElementById('rosterAwaitingCount');

        if (totalEl) totalEl.textContent = registrations.length || 3;
        if (checkedEl) checkedEl.textContent = Math.max(1, Math.floor(registrations.length * 0.75));
        if (awaitEl) awaitEl.textContent = Math.max(0, registrations.length - Math.floor(registrations.length * 0.75));

        if (registrations.length === 0) {
            list.innerHTML = `
                <div class="p-4 rounded-xl bg-surface-container-lowest text-center text-xs text-on-surface-variant">
                    No students registered yet for this event.
                </div>
            `;
            return;
        }

        list.innerHTML = registrations.map((r, i) => `
            <div class="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest shadow-xs text-xs font-label">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                        ${(r.user_name || 'ST').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div class="font-bold text-on-surface">${escapeHtml(r.user_name)}</div>
                        <div class="text-[11px] text-on-surface-variant font-label">${escapeHtml(r.user_email)} • ${escapeHtml(r.user_department || 'Computer Science')}</div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-fixed/50 px-2 py-0.5 rounded-full">
                        <span class="material-symbols-outlined text-[13px]">check_circle</span>
                        Gate ${(i % 4) + 1} Verified
                    </span>
                    <span class="text-[10px] text-on-surface-variant">09:${30 + (i * 4)} AM</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        list.innerHTML = `<p class="text-xs text-error p-3">${err.message}</p>`;
    }
}

// 6. Master CSV Export
function exportMasterCSV() {
    let csv = "Event ID,Title,Category,Date,Time,Capacity,Available Seats,Status\n";
    allEvents.forEach(e => {
        csv += `"${e.id}","${e.title}","${e.category}","${e.date}","${e.time}","${e.capacity}","${e.available_seats}","${e.status || 'upcoming'}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `UOL_Master_Event_Registry_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('📊 Master CSV Roster generated and downloaded.');
}

// --- AUTHENTICATION & PERSONA CONTROLLER ---
function initAuthSession() {
    const user = auth.getUser();
    updateAuthHeaderUI(user);
}

function updateAuthHeaderUI(user) {
    const btn = document.getElementById('authHeaderBtn');
    const text = document.getElementById('authHeaderBtnText');
    const adminPersona = document.getElementById('personaAdminBtn');
    const zohaPersona = document.getElementById('personaZohaBtn');
    const laibaPersona = document.getElementById('personaLaibaBtn');

    if (user) {
        if (text) text.textContent = `${user.name.split(' ')[0]} (Sign Out)`;
        if (btn) btn.onclick = () => auth.logout();

        const isAdmin = user.role === 'admin';
        if (adminPersona) {
            adminPersona.className = isAdmin 
                ? "px-2.5 py-1 text-xs rounded-lg font-medium transition-colors bg-tertiary-container text-on-tertiary-container font-semibold shadow-sm"
                : "px-2.5 py-1 text-xs rounded-lg font-medium transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface";
        }
        if (zohaPersona) {
            zohaPersona.className = (!isAdmin && user.email.includes('zoha'))
                ? "px-2.5 py-1 text-xs rounded-lg font-medium transition-colors bg-primary-container text-on-primary-container font-semibold shadow-sm"
                : "px-2.5 py-1 text-xs rounded-lg font-medium transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface";
        }
        if (laibaPersona) {
            laibaPersona.className = (!isAdmin && user.email.includes('laiba'))
                ? "px-2.5 py-1 text-xs rounded-lg font-medium transition-colors bg-primary-container text-on-primary-container font-semibold shadow-sm"
                : "px-2.5 py-1 text-xs rounded-lg font-medium transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface";
        }
    } else {
        if (text) text.textContent = "Sign In / Sign Up";
        if (btn) btn.onclick = () => openLoginModal();
    }
}

function openLoginModal() {
    setAuthMode('signin');
    openModal('authModal');
}

function setAuthMode(mode) {
    activeAuthMode = mode;
    const tabIn = document.getElementById('authTabSignIn');
    const tabUp = document.getElementById('authTabSignUp');
    const nameField = document.getElementById('authSignupNameField');
    const deptField = document.getElementById('authSignupDeptField');
    const submitBtn = document.getElementById('authSubmitBtn');
    const title = document.getElementById('authModalTitle');

    if (mode === 'signup') {
        if (tabIn) tabIn.className = "flex-1 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-1.5";
        if (tabUp) tabUp.className = "flex-1 py-2.5 rounded-xl bg-surface text-on-surface shadow-xs transition-all flex items-center justify-center gap-1.5 font-bold";
        if (nameField) nameField.style.display = 'block';
        if (deptField) deptField.style.display = 'block';
        if (submitBtn) submitBtn.innerHTML = `<span>Create University Account</span><span class="material-symbols-outlined text-base">person_add</span>`;
        if (title) title.textContent = "Create Student Profile";
    } else {
        if (tabUp) tabUp.className = "flex-1 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-1.5";
        if (tabIn) tabIn.className = "flex-1 py-2.5 rounded-xl bg-surface text-on-surface shadow-xs transition-all flex items-center justify-center gap-1.5 font-bold";
        if (nameField) nameField.style.display = 'none';
        if (deptField) deptField.style.display = 'none';
        if (submitBtn) submitBtn.innerHTML = `<span>Sign In to Campus Portal</span><span class="material-symbols-outlined text-base">arrow_forward</span>`;
        if (title) title.textContent = "Welcome Back";
    }
}

function quickFillAuth(email, pass, role) {
    setAuthMode('signin');
    document.getElementById('authInputEmail').value = email;
    document.getElementById('authInputPassword').value = pass;
}

async function quickDemoLogin(role) {
    try {
        const user = await auth.demoLogin(role);
        closeModal('authModal');
        updateAuthHeaderUI(user);
        showToast(`Authenticated as ${user.name} (${user.role.toUpperCase()})`);
        await loadEvents();
        await loadStats();

        if (user.role === 'admin') {
            navigateTo('admin-dashboard');
        } else {
            navigateTo('student-passes');
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('authInputEmail').value.trim();
    const password = document.getElementById('authInputPassword').value;

    try {
        let user;
        if (activeAuthMode === 'signup') {
            const name = document.getElementById('authInputName').value.trim();
            const dept = document.getElementById('authInputDept').value.trim();
            user = await auth.signup({ name, email, password, department: dept, role: 'student' });
            showToast('Account registered successfully!');
        } else {
            user = await auth.login(email, password);
            showToast(`Welcome back, ${user.name}!`);
        }
        closeModal('authModal');
        updateAuthHeaderUI(user);
        await loadEvents();
        await loadStats();

        if (user.role === 'admin') {
            navigateTo('admin-dashboard');
        } else {
            navigateTo('student-passes');
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function togglePasswordVisibility() {
    const input = document.getElementById('authInputPassword');
    const icon = document.getElementById('pwToggleIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility_off';
    } else {
        input.type = 'password';
        icon.textContent = 'visibility';
    }
}

// --- MODAL UTILITIES ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Toast System
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p-3.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 max-w-sm ${
        type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
    }`;
    toast.innerHTML = `
        <span class="material-symbols-outlined text-base">${type === 'error' ? 'error' : 'check_circle'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
