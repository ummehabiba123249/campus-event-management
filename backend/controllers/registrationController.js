const registrationModel = require('../models/registrationModel');
const userModel = require('../models/userModel');

const registrationController = {
    register: async (req, res) => {
        try {
            // Can get user_id from authenticated token, or from req.body (for testing flexibility)
            const event_id = req.body.event_id || req.body.eventId;
            let user_id = req.user ? req.user.id : req.body.user_id || req.body.userId;
            const { notes, student_name, student_email, student_roll_no } = req.body;

            // If user_id is not provided but email is, find or auto-create student user
            if (!user_id && student_email) {
                let user = await userModel.findByEmail(student_email);
                if (!user) {
                    user = await userModel.create({
                        name: student_name || 'Student',
                        email: student_email,
                        password: 'guest-account',
                        role: 'student',
                        department: req.body.department || 'Computer Science'
                    });
                }
                user_id = user.id;
            }

            if (!event_id || !user_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Event ID and Student identification (user_id or student_email) are required.'
                });
            }

            const registration = await registrationModel.create({
                user_id,
                event_id,
                notes: notes || (student_roll_no ? `Roll: ${student_roll_no}` : '')
            });

            return res.status(201).json({
                success: true,
                message: 'Successfully registered for the event!',
                registration
            });
        } catch (err) {
            console.error('Registration error:', err);
            return res.status(400).json({
                success: false,
                message: err.message || 'Failed to complete registration.'
            });
        }
    },

    getAllRegistrations: async (req, res) => {
        try {
            const registrations = await registrationModel.getAll();
            return res.status(200).json({
                success: true,
                count: registrations.length,
                registrations
            });
        } catch (err) {
            console.error('Error fetching registrations:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while fetching registrations.'
            });
        }
    },

    getUserRegistrations: async (req, res) => {
        try {
            const userId = req.params.userId || (req.user ? req.user.id : null);
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required.'
                });
            }

            const registrations = await registrationModel.getByUserId(userId);
            return res.status(200).json({
                success: true,
                count: registrations.length,
                registrations
            });
        } catch (err) {
            console.error('Error fetching user registrations:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while fetching user registrations.'
            });
        }
    },

    getEventRegistrations: async (req, res) => {
        try {
            const { eventId } = req.params;
            const registrations = await registrationModel.getByEventId(eventId);
            return res.status(200).json({
                success: true,
                count: registrations.length,
                registrations
            });
        } catch (err) {
            console.error('Error fetching event registrations:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while fetching event registrations.'
            });
        }
    },

    cancelRegistration: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user ? req.user.id : null;
            const isAdmin = req.user && req.user.role === 'admin';

            const cancelled = await registrationModel.cancel(id, userId, isAdmin || !userId);
            return res.status(200).json({
                success: true,
                message: 'Registration cancelled successfully.',
                registration: cancelled
            });
        } catch (err) {
            console.error('Error cancelling registration:', err);
            return res.status(400).json({
                success: false,
                message: err.message || 'Failed to cancel registration.'
            });
        }
    }
};

module.exports = registrationController;
