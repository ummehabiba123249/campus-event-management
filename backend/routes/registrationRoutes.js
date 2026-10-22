const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { optionalToken } = require('../middleware/authMiddleware');

// POST /api/register (or /api/registrations)
router.post('/', optionalToken, registrationController.register);

// GET /api/registrations - List all registrations
router.get('/', optionalToken, registrationController.getAllRegistrations);

// GET /api/registrations/user/:userId - List registrations for specific student
router.get('/user/:userId', optionalToken, registrationController.getUserRegistrations);

// GET /api/registrations/event/:eventId - List registrants for specific event
router.get('/event/:eventId', optionalToken, registrationController.getEventRegistrations);

// DELETE /api/registrations/:id - Cancel registration
router.delete('/:id', optionalToken, registrationController.cancelRegistration);

module.exports = router;
