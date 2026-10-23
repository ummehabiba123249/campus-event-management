const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

async function seedMySQL() {
    try {
        const caPath = path.join(__dirname, 'global-bundle.pem');
        const ca = fs.readFileSync(caPath);

        console.log('Connecting to AWS RDS MySQL at ' + process.env.DB_HOST + '...');
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: { ca }
        });

        console.log('1. Connected successfully to AWS RDS.');

        const dbName = process.env.DB_NAME || 'campus_events';
        await conn.query('CREATE DATABASE IF NOT EXISTS `' + dbName + '`');
        await conn.query('USE `' + dbName + '`');
        console.log('2. Selected database `' + dbName + '`.');

        const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.mysql.sql'), 'utf8');
        const statements = schemaSql.split(';').map(s => s.trim()).filter(Boolean);
        for (const stmt of statements) {
            await conn.query(stmt);
        }
        console.log('3. Schema tables verified.');

        const [uCount] = await conn.query('SELECT COUNT(*) as count FROM users');
        if (uCount[0].count === 0) {
            const saltRounds = 10;
            const studentPw = await bcrypt.hash('student123', saltRounds);
            const adminPw = await bcrypt.hash('admin123', saltRounds);

            const users = [
                ['Umme Habiba', '70176821@student.uol.edu.pk', studentPw, 'admin', 'Computer Science & IT'],
                ['Zoha Khalid', 'zoha.khalid@student.uol.edu.pk', studentPw, 'student', 'Software Engineering'],
                ['Laiba Aamir', 'laiba.aamir@student.uol.edu.pk', studentPw, 'student', 'Computer Science & IT'],
                ['Campus Administrator', 'admin@uol.edu.pk', adminPw, 'admin', 'Student Affairs'],
                ['Demo Student', 'student@uol.edu.pk', studentPw, 'student', 'Information Technology']
            ];

            for (const u of users) {
                await conn.query(
                    'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
                    u
                );
            }
            console.log('4. Seeded initial users (Umme Habiba, Zoha Khalid, Laiba Aamir, etc.).');

            const events = [
                [
                    'AI & Machine Learning Hands-on Workshop',
                    'A comprehensive full-day workshop covering Deep Learning, NLP, and practical applications with PyTorch. Led by industry experts and alumni.',
                    '2026-11-15',
                    '10:00 AM - 04:00 PM',
                    'Main Auditorium Hall A, UOL Campus',
                    'Workshop',
                    80,
                    76,
                    'Dr. Ahmad Raza (AI Lead Researcher)',
                    'Department of Computer Science',
                    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
                    'upcoming',
                    ''
                ],
                [
                    'Annual Intra-University Sports Gala 2026',
                    'Experience three days of thrilling sports competitions including Cricket, Football, Badminton, and Table Tennis with exciting trophies and medals.',
                    '2026-11-20',
                    '08:30 AM - 06:00 PM',
                    'University Sports Complex & Ground',
                    'Sports',
                    250,
                    247,
                    'Coach Tariq Khan',
                    'Sports Directorate',
                    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
                    'upcoming',
                    ''
                ],
                [
                    'National TechX Hackathon & Coding Competition',
                    '24-hour national level coding hackathon challenging university students to build scalable web, mobile, and AI solutions. Grand cash prize of PKR 100,000.',
                    '2026-12-05',
                    '09:00 AM - 09:00 AM (Next Day)',
                    'Software Engineering Labs 3 & 4',
                    'Competition',
                    60,
                    58,
                    'Engr. Sarah Malik (Senior Architect)',
                    'ACM Student Chapter',
                    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
                    'upcoming',
                    ''
                ],
                [
                    'Cloud Computing & DevOps Industry Seminar',
                    'Learn modern cloud-native architectures, Kubernetes, microservices, and continuous delivery pipelines from senior Silicon Valley engineers.',
                    '2026-11-28',
                    '02:00 PM - 05:00 PM',
                    'Executive Seminar Hall 2',
                    'Seminar',
                    120,
                    119,
                    'Salman Qureshi (Cloud Architect, AWS)',
                    'IEEE Computer Society',
                    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
                    'upcoming',
                    ''
                ],
                [
                    'IEEE Student Branch Innovation & Tech Summit',
                    'Showcase of cutting-edge FYP projects, robotics demonstrations, guest keynotes, and networking with leading Pakistani tech recruiters.',
                    '2026-12-12',
                    '11:00 AM - 04:30 PM',
                    'Business School Convention Center',
                    'Society Activities',
                    150,
                    150,
                    'Various Tech Executives',
                    'IEEE UOL Student Chapter',
                    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                    'upcoming',
                    ''
                ],
                [
                    'International Health & Biomedical Sciences Conference',
                    'Global symposium presenting peer-reviewed research papers in bioinformatics, biomedical engineering, and clinical artificial intelligence.',
                    '2026-12-18',
                    '09:00 AM - 05:00 PM',
                    'Health Sciences Complex Auditorium',
                    'Conference',
                    100,
                    100,
                    'Prof. Dr. David Evans & Local Panelists',
                    'Faculty of Allied Health Sciences',
                    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
                    'upcoming',
                    ''
                ]
            ];

            for (const e of events) {
                await conn.query(
                    'INSERT INTO events (title, description, date, time, location, category, capacity, available_seats, speaker, organizer, image_url, status, postponed_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    e
                );
            }
            console.log('5. Seeded campus events.');

            const regs = [
                [1, 1], [2, 1], [3, 1],
                [2, 2], [3, 2],
                [1, 3], [2, 3],
                [1, 4]
            ];

            for (const r of regs) {
                await conn.query(
                    'INSERT INTO registrations (user_id, event_id, status) VALUES (?, ?, ?)',
                    [r[0], r[1], 'confirmed']
                );
            }
            console.log('6. Seeded registrations.');
        } else {
            console.log('Database already populated with ' + uCount[0].count + ' users.');
        }

        console.log('🎉 AWS RDS MySQL initialization and data migration complete!');
        await conn.end();
    } catch (err) {
        console.error('MySQL Setup Error:', err);
        process.exit(1);
    }
}

seedMySQL();
