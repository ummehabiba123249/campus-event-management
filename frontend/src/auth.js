// Authentication & User Session Management

const auth = {
    getUser: () => {
        try {
            const userStr = localStorage.getItem('uol_event_user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    },

    getToken: () => {
        return localStorage.getItem('uol_event_token') || null;
    },

    isAuthenticated: () => {
        return !!auth.getToken();
    },

    isAdmin: () => {
        const user = auth.getUser();
        return user && user.role === 'admin';
    },

    login: async (email, password) => {
        const response = await api.login(email, password);
        if (response.success && response.token) {
            localStorage.setItem('uol_event_token', response.token);
            localStorage.setItem('uol_event_user', JSON.stringify(response.user));
            return response.user;
        }
        throw new Error(response.message || 'Login failed');
    },

    signup: async (userData) => {
        const response = await api.signup(userData);
        if (response.success && response.token) {
            localStorage.setItem('uol_event_token', response.token);
            localStorage.setItem('uol_event_user', JSON.stringify(response.user));
            return response.user;
        }
        throw new Error(response.message || 'Registration failed');
    },

    logout: () => {
        localStorage.removeItem('uol_event_token');
        localStorage.removeItem('uol_event_user');
        window.location.reload();
    },

    // Quick demo login convenience helper
    demoLogin: async (role) => {
        let email = '70176821@student.uol.edu.pk'; // Umme Habiba (Lead / Admin)
        let pass = 'student123';

        if (role === 'admin') {
            email = 'admin@uol.edu.pk';
            pass = 'admin123';
        } else if (role === 'zoha') {
            email = 'zoha.khalid@student.uol.edu.pk';
            pass = 'student123';
        } else if (role === 'laiba') {
            email = 'laiba.aamir@student.uol.edu.pk';
            pass = 'student123';
        } else if (role === 'student') {
            email = 'student@uol.edu.pk';
            pass = 'student123';
        }

        return await auth.login(email, pass);
    }
};

window.auth = auth;
