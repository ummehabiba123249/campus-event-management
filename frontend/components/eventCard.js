// Event Card Component - Modernized with Postpone, Status & Admin Controls

function createEventCard(event) {
    const isFull = event.available_seats <= 0;
    const capacityPct = Math.round(((event.capacity - event.available_seats) / event.capacity) * 100);
    const isPostponed = event.status === 'postponed';
    const isAdmin = window.auth && window.auth.isAdmin();

    return `
        <div class="event-card" data-category="${event.category}" data-id="${event.id}">
            <div class="event-card-media">
                <img src="${event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}" 
                     alt="${escapeHtml(event.title)}" class="event-card-img" loading="lazy">
                
                <div class="event-badge-group">
                    <span class="event-badge ${event.category}">${event.category}</span>
                    ${isPostponed ? `
                        <span class="status-badge-postponed">
                            ⏸️ Postponed
                        </span>
                    ` : ''}
                </div>
            </div>

            <div class="event-card-body">
                <h3 class="event-card-title">${escapeHtml(event.title)}</h3>
                <p class="event-card-desc">${escapeHtml(event.description)}</p>

                ${isPostponed ? `
                    <div class="postponed-notice-box">
                        <span>📢</span>
                        <div>
                            <strong>Event Rescheduled:</strong> ${escapeHtml(event.postponed_note || `New Date: ${event.date}`)}
                        </div>
                    </div>
                ` : ''}

                <div class="event-meta-list">
                    <div class="event-meta-item">
                        <span class="event-meta-icon">📅</span>
                        <span><strong>${event.date}</strong> • ${escapeHtml(event.time)}</span>
                    </div>
                    <div class="event-meta-item">
                        <span class="event-meta-icon">📍</span>
                        <span>${escapeHtml(event.location)}</span>
                    </div>
                    <div class="event-meta-item">
                        <span class="event-meta-icon">🎤</span>
                        <span>Speaker: ${escapeHtml(event.speaker || 'Campus Faculty')}</span>
                    </div>
                </div>

                <div class="capacity-container">
                    <div class="capacity-header">
                        <span>${isFull ? '🔴 Capacity Reached' : '🟢 Seats Available'}</span>
                        <span>${event.available_seats} of ${event.capacity} left</span>
                    </div>
                    <div class="capacity-bar">
                        <div class="capacity-fill" style="width: ${capacityPct}%; background-color: ${isFull ? 'var(--accent-rose)' : 'var(--brand-primary)'};"></div>
                    </div>
                </div>

                <div class="event-card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="openEventDetailsModal(${event.id})">
                        Details
                    </button>
                    <button class="btn btn-primary btn-sm" 
                            ${isFull ? 'disabled' : ''} 
                            onclick="prepareRegistrationModal(${event.id})">
                        ${isFull ? 'Sold Out' : 'Register Now'}
                    </button>
                </div>

                ${isAdmin ? `
                    <div style="display: flex; gap: 0.4rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-subtle);">
                        <button class="btn btn-warning btn-sm" style="flex: 1;" onclick="openPostponeModal(${event.id})">
                            ⏸️ Postpone
                        </button>
                        <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="openEditEventModal(${event.id})">
                            ✏️ Edit
                        </button>
                        <button class="btn btn-danger btn-sm" style="flex: 1;" onclick="deleteEventAction(${event.id})">
                            🗑️ Delete
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

window.createEventCard = createEventCard;
