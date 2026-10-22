const { query } = require('../database/db');

const eventModel = {
    getAll: async ({ search = '', category = '' } = {}) => {
        let sql = `
            SELECT e.*, 
                   (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') as registered_count
            FROM events e
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            sql += ` AND (LOWER(e.title) LIKE ? OR LOWER(e.description) LIKE ? OR LOWER(e.location) LIKE ?)`;
            const wildcard = `%${search.toLowerCase()}%`;
            params.push(wildcard, wildcard, wildcard);
        }

        if (category && category !== 'All') {
            sql += ` AND LOWER(e.category) = LOWER(?)`;
            params.push(category);
        }

        sql += ` ORDER BY e.date ASC, e.time ASC`;

        return await query.all(sql, params);
    },

    getById: async (id) => {
        const sql = `
            SELECT e.*, 
                   (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') as registered_count
            FROM events e
            WHERE e.id = ?
        `;
        return await query.get(sql, [id]);
    },

    create: async ({ title, description, date, time, location, category, capacity, speaker, organizer, image_url }) => {
        const cap = parseInt(capacity, 10) || 50;
        const available = cap;
        const result = await query.run(
            `INSERT INTO events (title, description, date, time, location, category, capacity, available_seats, speaker, organizer, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description,
                date,
                time,
                location,
                category,
                cap,
                available,
                speaker || 'University Guest',
                organizer || 'Campus Event Committee',
                image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
            ]
        );
        return await eventModel.getById(result.lastID);
    },

    update: async (id, fields) => {
        const existing = await eventModel.getById(id);
        if (!existing) return null;

        const updated = {
            title: fields.title !== undefined ? fields.title : existing.title,
            description: fields.description !== undefined ? fields.description : existing.description,
            date: fields.date !== undefined ? fields.date : existing.date,
            time: fields.time !== undefined ? fields.time : existing.time,
            location: fields.location !== undefined ? fields.location : existing.location,
            category: fields.category !== undefined ? fields.category : existing.category,
            capacity: fields.capacity !== undefined ? parseInt(fields.capacity, 10) : existing.capacity,
            speaker: fields.speaker !== undefined ? fields.speaker : existing.speaker,
            organizer: fields.organizer !== undefined ? fields.organizer : existing.organizer,
            image_url: fields.image_url !== undefined ? fields.image_url : existing.image_url
        };

        // Recalculate available seats based on new capacity minus current confirmed count
        const available_seats = Math.max(0, updated.capacity - existing.registered_count);

        await query.run(
            `UPDATE events 
             SET title = ?, description = ?, date = ?, time = ?, location = ?, category = ?, capacity = ?, available_seats = ?, speaker = ?, organizer = ?, image_url = ?
             WHERE id = ?`,
            [
                updated.title,
                updated.description,
                updated.date,
                updated.time,
                updated.location,
                updated.category,
                updated.capacity,
                available_seats,
                updated.speaker,
                updated.organizer,
                updated.image_url,
                id
            ]
        );

        return await eventModel.getById(id);
    },

    delete: async (id) => {
        const result = await query.run('DELETE FROM events WHERE id = ?', [id]);
        return result.changes > 0;
    },

    decrementSeats: async (eventId) => {
        await query.run(
            'UPDATE events SET available_seats = MAX(0, available_seats - 1) WHERE id = ?',
            [eventId]
        );
    },

    incrementSeats: async (eventId) => {
        await query.run(
            'UPDATE events SET available_seats = MIN(capacity, available_seats + 1) WHERE id = ?',
            [eventId]
        );
    }
};

module.exports = eventModel;
