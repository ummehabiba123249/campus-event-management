const eventModel = require('../models/eventModel');

const eventController = {
    getAllEvents: async (req, res) => {
        try {
            const { search, category } = req.query;
            const events = await eventModel.getAll({ search, category });
            return res.status(200).json({
                success: true,
                count: events.length,
                events
            });
        } catch (err) {
            console.error('Error fetching events:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while fetching events.'
            });
        }
    },

    getEventById: async (req, res) => {
        try {
            const { id } = req.params;
            const event = await eventModel.getById(id);
            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: `Event with ID ${id} not found.`
                });
            }
            return res.status(200).json({
                success: true,
                event
            });
        } catch (err) {
            console.error('Error fetching event details:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while fetching event details.'
            });
        }
    },

    createEvent: async (req, res) => {
        try {
            const { title, description, date, time, location, category, capacity, speaker, organizer, image_url, status, postponed_note } = req.body;

            if (!title || !description || !date || !time || !location || !category) {
                return res.status(400).json({
                    success: false,
                    message: 'Title, description, date, time, location, and category are required.'
                });
            }

            const newEvent = await eventModel.create({
                title,
                description,
                date,
                time,
                location,
                category,
                capacity: capacity ? parseInt(capacity, 10) : 50,
                speaker,
                organizer,
                image_url,
                status: status || 'upcoming',
                postponed_note: postponed_note || ''
            });

            return res.status(201).json({
                success: true,
                message: 'Campus event created successfully!',
                event: newEvent
            });
        } catch (err) {
            console.error('Error creating event:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while creating event.'
            });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedEvent = await eventModel.update(id, req.body);
            if (!updatedEvent) {
                return res.status(404).json({
                    success: false,
                    message: `Event with ID ${id} not found.`
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Event updated successfully!',
                event: updatedEvent
            });
        } catch (err) {
            console.error('Error updating event:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while updating event.'
            });
        }
    },

    postponeEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const { new_date, new_time, note } = req.body;

            if (!new_date) {
                return res.status(400).json({
                    success: false,
                    message: 'New event date is required to postpone.'
                });
            }

            const updated = await eventModel.postpone(id, new_date, new_time, note);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: `Event with ID ${id} not found.`
                });
            }

            return res.status(200).json({
                success: true,
                message: `Event #${id} has been postponed successfully to ${new_date}.`,
                event: updated
            });
        } catch (err) {
            console.error('Error postponing event:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while postponing event.'
            });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const success = await eventModel.delete(id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: `Event with ID ${id} not found.`
                });
            }
            return res.status(200).json({
                success: true,
                message: `Event #${id} deleted successfully.`
            });
        } catch (err) {
            console.error('Error deleting event:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while deleting event.'
            });
        }
    }
};

module.exports = eventController;
