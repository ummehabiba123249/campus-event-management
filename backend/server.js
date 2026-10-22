const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initSchema, query } = require('./database/db');
const { seedDatabase } = require('./database/seed');

// Import Route handlers
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const authController = require('./controllers/authController');
const registrationController = require('./controllers/registrationController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve Frontend static files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// API Routes
// 1. Events API (as specified in Project Requirements)
app.use('/api/events', eventRoutes);

// 2. Student Registration API
app.use('/api/registrations', registrationRoutes);
// Direct alias for POST /api/register matching requirement sheet exactly
app.post('/api/register', registrationController.register);

// 3. Authentication APIs (matching requirement sheet exactly)
app.post('/api/login', authController.login);
app.post('/api/signup', authController.signup);
app.use('/api/auth', authRoutes);

// 4. System Health & Summary Statistics
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'Campus Event Management System API',
        timestamp: new Date().toISOString(),
        team: [
            { role: 'Student 1 - Team Lead', name: 'Umme Habiba', email: '70176821@student.uol.edu.pk' },
            { role: 'Student 2 - Front-End Developer 1', name: 'Zoha Khalid', email: 'zoha.khalid@student.uol.edu.pk' },
            { role: 'Student 3 - Front-End Developer 2', name: 'Umme Habiba', email: '70176821@student.uol.edu.pk' },
            { role: 'Student 4 - Back-End Developer 1', name: 'Laiba Aamir', email: 'laiba.aamir@student.uol.edu.pk' },
            { role: 'Student 5 - Back-End Developer 2 / DB & Testing', name: 'Laiba Aamir', email: 'laiba.aamir@student.uol.edu.pk' }
        ]
    });
});

app.get('/api/stats', async (req, res) => {
    try {
        const eventsCount = await query.get('SELECT COUNT(*) as count FROM events');
        const usersCount = await query.get('SELECT COUNT(*) as count FROM users');
        const registrationsCount = await query.get("SELECT COUNT(*) as count FROM registrations WHERE status = 'confirmed'");
        const categoriesCount = await query.all('SELECT category, COUNT(*) as count FROM events GROUP BY category');

        res.status(200).json({
            success: true,
            total_events: eventsCount ? eventsCount.count : 0,
            total_students: usersCount ? usersCount.count : 0,
            total_registrations: registrationsCount ? registrationsCount.count : 0,
            categories: categoriesCount
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Fallback handler for client routing and 404
app.use((req, res, next) => {
    // If request is for an API endpoint that wasn't caught, return JSON 404
    if (req.url.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            message: `Endpoint ${req.method} ${req.url} not found.`
        });
    }
    // Otherwise serve frontend index.html
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend index.html not found yet.');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'An unexpected internal server error occurred.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Initialize DB and Start Server
const startServer = async () => {
    try {
        await initSchema();
        await seedDatabase();

        app.listen(PORT, () => {
            console.log(`=======================================================`);
            console.log(`🚀 Campus Event Management System Server Running!`);
            console.log(`🌐 Web URL : http://localhost:${PORT}`);
            console.log(`📡 API URL : http://localhost:${PORT}/api/events`);
            console.log(`👥 Lead    : Umme Habiba (70176821@student.uol.edu.pk)`);
            console.log(`👥 Members : Zoha Khalid, Laiba Aamir`);
            console.log(`=======================================================`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;
