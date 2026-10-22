const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { optionalToken } = require('../middleware/authMiddleware');

// GET /api/events - Retrieve all events with search & category filters
router.get('/', eventController.getAllEvents);

// GET /api/events/:id - Retrieve single event by ID
router.get('/:id', eventController.getEventById);

// POST /api/events - Create new campus event
router.post('/', optionalToken, eventController.createEvent);

// PUT /api/events/:id - Update existing event
router.put('/:id', optionalToken, eventController.updateEvent);

// POST /api/events/:id/postpone - Postpone / reschedule an event
router.post('/:id/postpone', optionalToken, eventController.postponeEvent);
router.put('/:id/postpone', optionalToken, eventController.postponeEvent);

// DELETE /api/events/:id - Delete event
router.delete('/:id', optionalToken, eventController.deleteEvent);

module.exports = router;
