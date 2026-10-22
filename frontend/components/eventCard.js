// Event Card Component

function createEventCard(event) {
    const isFull = event.available_seats <= 0;
    const capacityPct = Math.round(((event.capacity - event.available_seats) / event.capacity) * 100);

    return `
        <div class="event-card" data-category="${event.category}" data-id="${event.id}">
            <div class="event-card-media">
                <img src="${event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}" 
                     alt="${event.title}" class="event-card-img" loading="lazy">
                <span class="event-badge ${event.category}">${event.category}</span>
            </div>

            <div class="event-card-body">
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-card-desc">${event.description}</p>

                <div class="event-meta-list">
                    <div class="event-meta-item">
                        <span class="event-meta-icon">📅</span>
                        <span>${event.date} • ${event.time}</span>
                    </div>
                    <div class="event-meta-item">
                        <span class="event-meta-icon">📍</span>
                        <span>${event.location}</span>
                    </div>
                    <div class="event-meta-item">
                        <span class="event-meta-icon">🎤</span>
                        <span>Speaker: ${event.speaker || 'Campus Faculty'}</span>
                    </div>
                </div>

                <div class="capacity-container">
                    <div class="capacity-header">
                        <span>${isFull ? '🔴 Fully Booked' : '🟢 Seats Available'}</span>
                        <span>${event.available_seats} of ${event.capacity} left</span>
                    </div>
                    <div class="capacity-bar">
                        <div class="capacity-fill" style="width: ${capacityPct}%; background-color: ${isFull ? 'var(--danger)' : 'var(--primary)'};"></div>
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
            </div>
        </div>
    `;
}

window.createEventCard = createEventCard;
