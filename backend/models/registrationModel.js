const { query } = require('../database/db');
const eventModel = require('./eventModel');

const registrationModel = {
    create: async ({ user_id, event_id, notes = '' }) => {
        // Verify event has available seats
        const event = await eventModel.getById(event_id);
        if (!event) {
            throw new Error('Event not found');
        }
        if (event.available_seats <= 0) {
            throw new Error('This event is fully booked. No available seats remaining.');
        }

        // Check if user is already registered
        const existing = await query.get(
            'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
            [user_id, event_id]
        );

        if (existing) {
            if (existing.status === 'confirmed') {
                throw new Error('You are already registered for this event.');
            } else {
                // Reactivate previously cancelled registration
                await query.run(
                    'UPDATE registrations SET status = ?, registration_date = CURRENT_TIMESTAMP WHERE id = ?',
                    ['confirmed', existing.id]
                );
                await eventModel.decrementSeats(event_id);
                return await registrationModel.getById(existing.id);
            }
        }

        const result = await query.run(
            'INSERT INTO registrations (user_id, event_id, status, notes) VALUES (?, ?, ?, ?)',
            [user_id, event_id, 'confirmed', notes]
        );

        // Decrement available seat count
        await eventModel.decrementSeats(event_id);

        return await registrationModel.getById(result.lastID);
    },

    getById: async (id) => {
        const sql = `
            SELECT r.*, 
                   u.name as user_name, u.email as user_email, u.department as user_department,
                   e.title as event_title, e.date as event_date, e.time as event_time, 
                   e.location as event_location, e.category as event_category
            FROM registrations r
            JOIN users u ON r.user_id = u.id
            JOIN events e ON r.event_id = e.id
            WHERE r.id = ?
        `;
        return await query.get(sql, [id]);
    },

    getAll: async () => {
        const sql = `
            SELECT r.*, 
                   u.name as user_name, u.email as user_email, u.department as user_department,
                   e.title as event_title, e.date as event_date, e.time as event_time, 
                   e.location as event_location, e.category as event_category
            FROM registrations r
            JOIN users u ON r.user_id = u.id
            JOIN events e ON r.event_id = e.id
            ORDER BY r.registration_date DESC
        `;
        return await query.all(sql);
    },

    getByUserId: async (user_id) => {
        const sql = `
            SELECT r.*, 
                   e.title as event_title, e.description as event_description,
                   e.date as event_date, e.time as event_time, 
                   e.location as event_location, e.category as event_category,
                   e.image_url as event_image_url
            FROM registrations r
            JOIN events e ON r.event_id = e.id
            WHERE r.user_id = ?
            ORDER BY r.registration_date DESC
        `;
        return await query.all(sql, [user_id]);
    },

    getByEventId: async (event_id) => {
        const sql = `
            SELECT r.*, 
                   u.name as user_name, u.email as user_email, u.department as user_department
            FROM registrations r
            JOIN users u ON r.user_id = u.id
            WHERE r.event_id = ?
            ORDER BY r.registration_date ASC
        `;
        return await query.all(sql, [event_id]);
    },

    cancel: async (id, user_id, isAdmin = false) => {
        const reg = await query.get('SELECT * FROM registrations WHERE id = ?', [id]);
        if (!reg) {
            throw new Error('Registration record not found.');
        }

        if (!isAdmin && reg.user_id !== user_id) {
            throw new Error('Unauthorized to cancel this registration.');
        }

        if (reg.status === 'cancelled') {
            return reg;
        }

        await query.run('UPDATE registrations SET status = ? WHERE id = ?', ['cancelled', id]);
        await eventModel.incrementSeats(reg.event_id);

        return await registrationModel.getById(id);
    }
};

module.exports = registrationModel;
