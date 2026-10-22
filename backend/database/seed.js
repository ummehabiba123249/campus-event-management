const bcrypt = require('bcryptjs');
const { query, initSchema } = require('./db');

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        await initSchema();

        // Check if users already exist
        const userCount = await query.get('SELECT COUNT(*) as count FROM users');
        if (userCount && userCount.count > 0) {
            console.log('ℹ️ Database already seeded. Skipping.');
            return;
        }

        const saltRounds = 10;
        const studentPasswordHash = await bcrypt.hash('student123', saltRounds);
        const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);

        // Insert team members & demo accounts
        const users = [
            {
                name: 'Umme Habiba',
                email: '70176821@student.uol.edu.pk',
                password: studentPasswordHash,
                role: 'admin',
                department: 'Computer Science & IT'
            },
            {
                name: 'Zoha Khalid',
                email: 'zoha.khalid@student.uol.edu.pk',
                password: studentPasswordHash,
                role: 'student',
                department: 'Software Engineering'
            },
            {
                name: 'Laiba Aamir',
                email: 'laiba.aamir@student.uol.edu.pk',
                password: studentPasswordHash,
                role: 'student',
                department: 'Computer Science & IT'
            },
            {
                name: 'Campus Administrator',
                email: 'admin@uol.edu.pk',
                password: adminPasswordHash,
                role: 'admin',
                department: 'Student Affairs'
            },
            {
                name: 'Demo Student',
                email: 'student@uol.edu.pk',
                password: studentPasswordHash,
                role: 'student',
                department: 'Information Technology'
            }
        ];

        for (const u of users) {
            await query.run(
                'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
                [u.name, u.email, u.password, u.role, u.department]
            );
        }
        console.log(`✅ Seeded ${users.length} users successfully.`);

        // Insert Campus Events
        const events = [
            {
                title: 'AI & Machine Learning Hands-on Workshop',
                description: 'A comprehensive full-day workshop covering Deep Learning, NLP, and practical applications with PyTorch. Led by industry experts and alumni.',
                date: '2026-11-15',
                time: '10:00 AM - 04:00 PM',
                location: 'Main Auditorium Hall A, UOL Campus',
                category: 'Workshop',
                capacity: 80,
                available_seats: 76,
                speaker: 'Dr. Ahmad Raza (AI Lead Researcher)',
                organizer: 'Department of Computer Science',
                image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Annual Intra-University Sports Gala 2026',
                description: 'Experience three days of thrilling sports competitions including Cricket, Football, Badminton, and Table Tennis with exciting trophies and medals.',
                date: '2026-11-20',
                time: '08:30 AM - 06:00 PM',
                location: 'University Sports Complex & Ground',
                category: 'Sports',
                capacity: 250,
                available_seats: 247,
                speaker: 'Coach Tariq Khan',
                organizer: 'Sports Directorate',
                image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'National TechX Hackathon & Coding Competition',
                description: '24-hour national level coding hackathon challenging university students to build scalable web, mobile, and AI solutions. Grand cash prize of PKR 100,000.',
                date: '2026-12-05',
                time: '09:00 AM - 09:00 AM (Next Day)',
                location: 'Software Engineering Labs 3 & 4',
                category: 'Competition',
                capacity: 60,
                available_seats: 58,
                speaker: 'Engr. Sarah Malik (Senior Architect)',
                organizer: 'ACM Student Chapter',
                image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Cloud Computing & DevOps Industry Seminar',
                description: 'Learn modern cloud-native architectures, Kubernetes, microservices, and continuous delivery pipelines from senior Silicon Valley engineers.',
                date: '2026-11-28',
                time: '02:00 PM - 05:00 PM',
                location: 'Executive Seminar Hall 2',
                category: 'Seminar',
                capacity: 120,
                available_seats: 119,
                speaker: 'Salman Qureshi (Cloud Architect, AWS)',
                organizer: 'IEEE Computer Society',
                image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'IEEE Student Branch Innovation & Tech Summit',
                description: 'Showcase of cutting-edge FYP projects, robotics demonstrations, guest keynotes, and networking with leading Pakistani tech recruiters.',
                date: '2026-12-12',
                time: '11:00 AM - 04:30 PM',
                location: 'Business School Convention Center',
                category: 'Society Activities',
                capacity: 150,
                available_seats: 150,
                speaker: 'Various Tech Executives',
                organizer: 'IEEE UOL Student Chapter',
                image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'International Health & Biomedical Sciences Conference',
                description: 'Global symposium presenting peer-reviewed research papers in bioinformatics, biomedical engineering, and clinical artificial intelligence.',
                date: '2026-12-18',
                time: '09:00 AM - 05:00 PM',
                location: 'Health Sciences Complex Auditorium',
                category: 'Conference',
                capacity: 100,
                available_seats: 100,
                speaker: 'Prof. Dr. David Evans & Local Panelists',
                organizer: 'Faculty of Allied Health Sciences',
                image_url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80'
            }
        ];

        for (const e of events) {
            await query.run(
                `INSERT INTO events (title, description, date, time, location, category, capacity, available_seats, speaker, organizer, image_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [e.title, e.description, e.date, e.time, e.location, e.category, e.capacity, e.available_seats, e.speaker, e.organizer, e.image_url]
            );
        }
        console.log(`✅ Seeded ${events.length} campus events successfully.`);

        // Insert initial registrations
        const registrations = [
            { userId: 1, eventId: 1 },
            { userId: 2, eventId: 1 },
            { userId: 3, eventId: 1 },
            { userId: 2, eventId: 2 },
            { userId: 3, eventId: 2 },
            { userId: 1, eventId: 3 },
            { userId: 2, eventId: 3 },
            { userId: 1, eventId: 4 }
        ];

        for (const r of registrations) {
            await query.run(
                'INSERT INTO registrations (user_id, event_id, status) VALUES (?, ?, ?)',
                [r.userId, r.eventId, 'confirmed']
            );
        }
        console.log(`✅ Seeded ${registrations.length} registrations.`);

        console.log('🎉 Database seeding completed successfully.');
    } catch (err) {
        console.error('❌ Database seeding error:', err);
    }
};

if (require.main === module) {
    seedDatabase().then(() => {
        process.exit(0);
    });
}

module.exports = { seedDatabase };
