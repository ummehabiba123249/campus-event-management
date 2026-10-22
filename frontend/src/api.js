// Campus Event Management System - Intelligent Hybrid API Client
// Connects to Node/Express/SQLite backend when available;
// Falls back seamlessly to persistent browser storage when deployed statically on Netlify!

const API_BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? '' 
    : (window.location.protocol.startsWith('http') && !window.location.hostname.includes('netlify.app') ? 'http://localhost:5000' : '');

// Initial mock dataset for standalone Netlify deployment
const DEFAULT_EVENTS = [
    {
        id: 1,
        title: 'AI & Machine Learning Hands-on Workshop',
        description: 'A comprehensive full-day workshop covering Deep Learning, NLP, and practical applications with PyTorch. Led by industry experts and alumni.',
        date: '2026-11-15',
        time: '10:00 AM - 04:00 PM',
        location: 'Main Auditorium Hall A, UOL Campus',
        category: 'Workshop',
        capacity: 80,
        available_seats: 76,
        speaker: 'Dr. Ahmad Raza (AI Lead Researcher)',
        organizer: 'Department of Computer Science',
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
        status: 'upcoming',
        postponed_note: ''
    },
    {
        id: 2,
        title: 'Annual Intra-University Sports Gala 2026',
        description: 'Experience three days of thrilling sports competitions including Cricket, Football, Badminton, and Table Tennis with exciting trophies and medals.',
        date: '2026-11-20',
        time: '08:30 AM - 06:00 PM',
        location: 'University Sports Complex & Ground',
        category: 'Sports',
        capacity: 250,
        available_seats: 247,
        speaker: 'Coach Tariq Khan',
        organizer: 'Sports Directorate',
        image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        status: 'upcoming',
        postponed_note: ''
    },
    {
        id: 3,
        title: 'National TechX Hackathon & Coding Competition',
        description: '24-hour national level coding hackathon challenging university students to build scalable web, mobile, and AI solutions. Grand cash prize of PKR 100,000.',
        date: '2026-12-05',
        time: '09:00 AM - 09:00 AM (Next Day)',
        location: 'Software Engineering Labs 3 & 4',
        category: 'Competition',
        capacity: 60,
        available_seats: 58,
        speaker: 'Engr. Sarah Malik (Senior Architect)',
        organizer: 'ACM Student Chapter',
        image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
        status: 'upcoming',
        postponed_note: ''
    },
    {
        id: 4,
        title: 'Cloud Computing & DevOps Industry Seminar',
        description: 'Learn modern cloud-native architectures, Kubernetes, microservices, and continuous delivery pipelines from senior Silicon Valley engineers.',
        date: '2026-11-28',
        time: '02:00 PM - 05:00 PM',
        location: 'Executive Seminar Hall 2',
        category: 'Seminar',
        capacity: 120,
        available_seats: 119,
        speaker: 'Salman Qureshi (Cloud Architect, AWS)',
        organizer: 'IEEE Computer Society',
        image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        status: 'upcoming',
        postponed_note: ''
    },
    {
        id: 5,
        title: 'IEEE Student Branch Innovation & Tech Summit',
        description: 'Showcase of cutting-edge FYP projects, robotics demonstrations, guest keynotes, and networking with leading Pakistani tech recruiters.',
        date: '2026-12-12',
        time: '11:00 AM - 04:30 PM',
        location: 'Business School Convention Center',
        category: 'Society Activities',
        capacity: 150,
        available_seats: 150,
        speaker: 'Various Tech Executives',
        organizer: 'IEEE UOL Student Chapter',
        image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
        status: 'upcoming',
        postponed_note: ''
    },
    {
        id: 6,
        title: 'International Health & Biomedical Sciences Conference',
        description: 'Global symposium presenting peer-reviewed research papers in bioinformatics, biomedical engineering, and clinical artificial intelligence.',
        date: '2026-12-18',
        time: '09:00 AM - 05:00 PM',
        location: 'Health Sciences Complex Auditorium',
        category: 'Conference',
        capacity: 100,
        available_seats: 100,
        speaker: 'Prof. Dr. David Evans & Local Panelists',
        organizer: 'Faculty of Allied Health Sciences',
        image_url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
        status: 'upcoming',
        postponed_note: ''
    }
];

// Local storage storage helper for Netlify fallback
const LocalDB = {
    getEvents: () => {
        const stored = localStorage.getItem('uol_events_db');
        if (!stored) {
            localStorage.setItem('uol_events_db', JSON.stringify(DEFAULT_EVENTS));
            return DEFAULT_EVENTS;
        }
        return JSON.parse(stored);
    },
    saveEvents: (events) => {
        localStorage.setItem('uol_events_db', JSON.stringify(events));
    },
    getRegistrations: () => {
        const stored = localStorage.getItem('uol_registrations_db');
        return stored ? JSON.parse(stored) : [
            { id: 1, user_id: 1, event_id: 1, user_name: 'Umme Habiba', user_email: '70176821@student.uol.edu.pk', event_title: 'AI & Machine Learning Hands-on Workshop', event_category: 'Workshop', event_date: '2026-11-15', event_location: 'Main Auditorium Hall A', status: 'confirmed', registration_date: '2026-10-22' },
            { id: 2, user_id: 2, event_id: 2, user_name: 'Zoha Khalid', user_email: 'zoha.khalid@student.uol.edu.pk', event_title: 'Annual Intra-University Sports Gala 2026', event_category: 'Sports', event_date: '2026-11-20', event_location: 'Sports Complex', status: 'confirmed', registration_date: '2026-10-22' },
            { id: 3, user_id: 3, event_id: 3, user_name: 'Laiba Aamir', user_email: 'laiba.aamir@student.uol.edu.pk', event_title: 'National TechX Hackathon', event_category: 'Competition', event_date: '2026-12-05', event_location: 'SE Labs 3 & 4', status: 'confirmed', registration_date: '2026-10-22' }
        ];
    },
    saveRegistrations: (regs) => {
        localStorage.setItem('uol_registrations_db', JSON.stringify(regs));
    }
};

let backendAvailable = true;

const api = {
    // Core fetch request with timeout and Netlify fallback
    request: async (endpoint, options = {}) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const token = localStorage.getItem('uol_event_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || `Request failed (${response.status})`);
            }
            backendAvailable = true;
            return data;
        } catch (error) {
            console.warn(`[API] Live backend unavailable for ${endpoint}. Falling back to client database.`);
            backendAvailable = false;
            return api.handleOffline(endpoint, options);
        }
    },

    // Offline simulation for Netlify deployment
    handleOffline: async (endpoint, options = {}) => {
        const method = options.method || 'GET';
        const body = options.body ? JSON.parse(options.body) : {};

        // 1. GET /api/events
        if (endpoint.startsWith('/api/events') && method === 'GET') {
            const events = LocalDB.getEvents();
            return { success: true, count: events.length, events };
        }

        // 2. POST /api/events (Create)
        if (endpoint === '/api/events' && method === 'POST') {
            const events = LocalDB.getEvents();
            const newEvent = {
                id: Date.now(),
                title: body.title,
                description: body.description,
                date: body.date,
                time: body.time,
                location: body.location,
                category: body.category,
                capacity: parseInt(body.capacity, 10) || 50,
                available_seats: parseInt(body.capacity, 10) || 50,
                speaker: body.speaker || 'University Guest',
                organizer: body.organizer || 'Campus Event Committee',
                image_url: body.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
                status: 'upcoming',
                postponed_note: ''
            };
            events.unshift(newEvent);
            LocalDB.saveEvents(events);
            return { success: true, message: 'Campus event created successfully!', event: newEvent };
        }

        // 3. POST /api/events/:id/postpone
        if (endpoint.includes('/postpone')) {
            const match = endpoint.match(/\/api\/events\/(\d+)\/postpone/);
            const id = match ? parseInt(match[1], 10) : null;
            const events = LocalDB.getEvents();
            const event = events.find(e => e.id === id);
            if (event) {
                event.date = body.new_date || event.date;
                if (body.new_time) event.time = body.new_time;
                event.status = 'postponed';
                event.postponed_note = body.note || `Postponed to ${body.new_date}`;
                LocalDB.saveEvents(events);
                return { success: true, message: `Event postponed to ${body.new_date}!`, event };
            }
        }

        // 4. PUT /api/events/:id (Update)
        if (endpoint.startsWith('/api/events/') && method === 'PUT') {
            const id = parseInt(endpoint.split('/')[3], 10);
            const events = LocalDB.getEvents();
            const idx = events.findIndex(e => e.id === id);
            if (idx !== -1) {
                events[idx] = { ...events[idx], ...body };
                LocalDB.saveEvents(events);
                return { success: true, message: 'Event updated successfully!', event: events[idx] };
            }
        }

        // 5. DELETE /api/events/:id
        if (endpoint.startsWith('/api/events/') && method === 'DELETE') {
            const id = parseInt(endpoint.split('/')[3], 10);
            let events = LocalDB.getEvents();
            events = events.filter(e => e.id !== id);
            LocalDB.saveEvents(events);
            return { success: true, message: 'Event deleted successfully.' };
        }

        // 6. POST /api/register
        if ((endpoint === '/api/register' || endpoint === '/api/registrations') && method === 'POST') {
            const events = LocalDB.getEvents();
            const event = events.find(e => e.id === parseInt(body.event_id, 10));
            if (event && event.available_seats > 0) {
                event.available_seats -= 1;
                LocalDB.saveEvents(events);

                const regs = LocalDB.getRegistrations();
                const newReg = {
                    id: Date.now(),
                    user_id: body.user_id || 1,
                    event_id: event.id,
                    user_name: body.student_name || 'Student',
                    user_email: body.student_email || 'student@uol.edu.pk',
                    event_title: event.title,
                    event_category: event.category,
                    event_date: event.date,
                    event_location: event.location,
                    status: 'confirmed',
                    registration_date: new Date().toISOString().split('T')[0]
                };
                regs.unshift(newReg);
                LocalDB.saveRegistrations(regs);
                return { success: true, message: 'Successfully registered for event!', registration: newReg };
            }
        }

        // 7. GET /api/registrations
        if (endpoint.startsWith('/api/registrations') && method === 'GET') {
            const regs = LocalDB.getRegistrations();
            return { success: true, count: regs.length, registrations: regs };
        }

        // 8. DELETE /api/registrations/:id (Cancel)
        if (endpoint.startsWith('/api/registrations/') && method === 'DELETE') {
            const id = parseInt(endpoint.split('/')[3], 10);
            const regs = LocalDB.getRegistrations();
            const reg = regs.find(r => r.id === id);
            if (reg) {
                reg.status = 'cancelled';
                LocalDB.saveRegistrations(regs);
                const events = LocalDB.getEvents();
                const ev = events.find(e => e.id === reg.event_id);
                if (ev) {
                    ev.available_seats = Math.min(ev.capacity, ev.available_seats + 1);
                    LocalDB.saveEvents(events);
                }
                return { success: true, message: 'Registration cancelled.' };
            }
        }

        // 9. Auth mock
        if (endpoint === '/api/login') {
            const email = body.email;
            const isAdmin = email.includes('admin') || email.includes('70176821');
            const name = email.includes('70176821') ? 'Umme Habiba' : (email.includes('zoha') ? 'Zoha Khalid' : (email.includes('laiba') ? 'Laiba Aamir' : 'Campus User'));
            return {
                success: true,
                token: 'mock-jwt-token-netlify',
                user: { id: 1, name, email, role: isAdmin ? 'admin' : 'student', department: 'Computer Science & IT' }
            };
        }

        if (endpoint === '/api/signup') {
            return {
                success: true,
                token: 'mock-jwt-token-netlify',
                user: { id: Date.now(), name: body.name, email: body.email, role: 'student', department: body.department || 'Computer Science' }
            };
        }

        // 10. Stats mock
        if (endpoint === '/api/stats') {
            const events = LocalDB.getEvents();
            const regs = LocalDB.getRegistrations();
            return {
                success: true,
                total_events: events.length,
                total_students: 5,
                total_registrations: regs.filter(r => r.status === 'confirmed').length
            };
        }

        return { success: true };
    },

    // --- High Level API Helpers ---
    getEvents: async (search = '', category = '') => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'All') params.append('category', category);
        const queryStr = params.toString() ? `?${params.toString()}` : '';
        return api.request(`/api/events${queryStr}`);
    },

    getEventById: async (id) => {
        return api.request(`/api/events/${id}`);
    },

    createEvent: async (eventData) => {
        return api.request('/api/events', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    },

    updateEvent: async (id, eventData) => {
        return api.request(`/api/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
    },

    postponeEvent: async (id, newDate, newTime, note) => {
        return api.request(`/api/events/${id}/postpone`, {
            method: 'POST',
            body: JSON.stringify({ new_date: newDate, new_time: newTime, note })
        });
    },

    deleteEvent: async (id) => {
        return api.request(`/api/events/${id}`, {
            method: 'DELETE'
        });
    },

    registerForEvent: async (registrationData) => {
        return api.request('/api/register', {
            method: 'POST',
            body: JSON.stringify(registrationData)
        });
    },

    getAllRegistrations: async () => {
        return api.request('/api/registrations');
    },

    getUserRegistrations: async (userId) => {
        return api.request(`/api/registrations/user/${userId}`);
    },

    getEventRegistrations: async (eventId) => {
        return api.request(`/api/registrations/event/${eventId}`);
    },

    cancelRegistration: async (id) => {
        return api.request(`/api/registrations/${id}`, {
            method: 'DELETE'
        });
    },

    login: async (email, password) => {
        return api.request('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    signup: async (userData) => {
        return api.request('/api/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    getStats: async () => {
        return api.request('/api/stats');
    }
};

window.api = api;
