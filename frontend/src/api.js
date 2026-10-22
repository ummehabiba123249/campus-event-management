// Frontend API Service Client
// Communicates with Node.js/Express Backend REST APIs

const API_BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? '' // Use relative path when served by Express or reverse proxy
    : 'http://localhost:5000';

const api = {
    // Helper to send HTTP requests with optional auth headers
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
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
            throw error;
        }
    },

    // --- Events APIs ---
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

    deleteEvent: async (id) => {
        return api.request(`/api/events/${id}`, {
            method: 'DELETE'
        });
    },

    // --- Registration APIs ---
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

    // --- Authentication APIs ---
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

    // --- Statistics & Health ---
    getStats: async () => {
        return api.request('/api/stats');
    },

    getHealth: async () => {
        return api.request('/api/health');
    }
};

window.api = api;
