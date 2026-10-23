const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Ensure AWS RDS MySQL configuration is active in serverless environment
process.env.DB_TYPE = process.env.DB_TYPE || 'mysql';
process.env.DB_HOST = process.env.DB_HOST || 'database-1.cl6ku868e4ar.ap-southeast-2.rds.amazonaws.com';
process.env.DB_PORT = process.env.DB_PORT || '3306';
process.env.DB_USER = process.env.DB_USER || 'admin';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'alihaseeb001';
process.env.DB_NAME = process.env.DB_NAME || 'campus_events';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'uol_campus_event_jwt_super_secret_key_2026';

const { initSchema, query } = require('../../backend/database/db');
const authRoutes = require('../../backend/routes/authRoutes');
const eventRoutes = require('../../backend/routes/eventRoutes');
const registrationRoutes = require('../../backend/routes/registrationRoutes');
const authController = require('../../backend/controllers/authController');
const registrationController = require('../../backend/controllers/registrationController');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Warmup/Schema initialization flag
let initialized = false;
app.use(async (req, res, next) => {
    if (!initialized) {
        try {
            await initSchema();
            initialized = true;
        } catch (err) {
            console.error('[Netlify Function] DB init warning:', err.message);
        }
    }
    next();
});

// Router configuration
const router = express.Router();

router.use('/events', eventRoutes);
router.use('/registrations', registrationRoutes);
router.post('/register', registrationController.register);
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.use('/auth', authRoutes);

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'AWS RDS MySQL Netlify Serverless API',
        database: 'MySQL on AWS RDS',
        host: process.env.DB_HOST
    });
});

router.get('/stats', async (req, res) => {
    try {
        const eventsCount = await query.get('SELECT COUNT(*) as count FROM events');
        const usersCount = await query.get('SELECT COUNT(*) as count FROM users');
        const registrationsCount = await query.get("SELECT COUNT(*) as count FROM registrations WHERE status = 'confirmed'");

        res.status(200).json({
            success: true,
            total_events: eventsCount ? eventsCount.count : 0,
            total_students: usersCount ? usersCount.count : 0,
            total_registrations: registrationsCount ? registrationsCount.count : 0
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Mount router on all path variations handled by Netlify redirects
app.use('/.netlify/functions/api', router);
app.use('/api', router);
app.use('/', router);

module.exports.handler = serverless(app);
