const path = require('path');
const fs = require('fs');

const DB_TYPE = (process.env.DB_TYPE || 'sqlite').toLowerCase();
let activeEngine = 'sqlite';

// Lazy SQLite Database setup (avoids bundling/loading issues in serverless Linux environments)
let sqliteDb = null;
function getSqlite() {
    if (!sqliteDb) {
        try {
            const sqlite3 = require('sqlite3').verbose();
            const SQLITE_PATH = process.env.DB_PATH || path.join(__dirname, 'campus_events.db');
            const dbDir = path.dirname(SQLITE_PATH);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }
            sqliteDb = new sqlite3.Database(SQLITE_PATH, (err) => {
                if (!err) {
                    sqliteDb.run('PRAGMA foreign_keys = ON');
                }
            });
        } catch (e) {
            console.warn('[DB] SQLite native driver not available in this environment.');
        }
    }
    return sqliteDb;
}

// MySQL Database Pool Setup
let mysqlPool = null;
let mysql = null;
try {
    mysql = require('mysql2/promise');
} catch (e) {
    // mysql2 package optional
}

async function tryConnectMysql() {
    if (!mysql || DB_TYPE !== 'mysql' || !process.env.DB_HOST) {
        activeEngine = 'sqlite';
        return false;
    }

    if (!process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'YOUR_AWS_RDS_PASSWORD') {
        console.log('ℹ️ AWS RDS MySQL configured. Awaiting password in .env (falling back to SQLite).');
        activeEngine = 'sqlite';
        return false;
    }

    try {
        const dbName = process.env.DB_NAME || 'campus_events';

        // Connect with SSL enabled (rejectUnauthorized: false works directly on AWS RDS without requiring external file paths)
        const rootConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'admin',
            password: process.env.DB_PASSWORD,
            ssl: { rejectUnauthorized: false },
            connectTimeout: 7000
        });

        await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await rootConn.end();

        mysqlPool = mysql.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'admin',
            password: process.env.DB_PASSWORD,
            database: dbName,
            ssl: { rejectUnauthorized: false },
            waitForConnections: true,
            connectionLimit: 10,
            connectTimeout: 7000
        });

        await mysqlPool.query('SELECT 1');
        activeEngine = 'mysql';
        console.log(`✅ AWS RDS MySQL Database connected successfully at ${process.env.DB_HOST}:${process.env.DB_PORT}/${dbName}`);
        return true;
    } catch (err) {
        console.warn(`⚠️ Could not connect to AWS RDS MySQL (${err.message}). Using SQLite as active database.`);
        activeEngine = 'sqlite';
        return false;
    }
}

// Unified Query Interface
const query = {
    all: async (sql, params = []) => {
        if (activeEngine === 'mysql' && mysqlPool) {
            const [rows] = await mysqlPool.query(sql, params);
            return rows;
        }
        const db = getSqlite();
        if (!db) throw new Error('No active database engine available.');
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    get: async (sql, params = []) => {
        if (activeEngine === 'mysql' && mysqlPool) {
            const [rows] = await mysqlPool.query(sql, params);
            return rows && rows.length > 0 ? rows[0] : null;
        }
        const db = getSqlite();
        if (!db) throw new Error('No active database engine available.');
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    },

    run: async (sql, params = []) => {
        if (activeEngine === 'mysql' && mysqlPool) {
            const [result] = await mysqlPool.query(sql, params);
            return { lastID: result.insertId, changes: result.affectedRows };
        }
        const db = getSqlite();
        if (!db) throw new Error('No active database engine available.');
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    },

    exec: async (sql) => {
        if (activeEngine === 'mysql' && mysqlPool) {
            const statements = sql
                .split(';')
                .map((s) => s.trim())
                .filter(Boolean);
            for (const s of statements) {
                await mysqlPool.query(s);
            }
            return;
        }
        const db = getSqlite();
        if (!db) throw new Error('No active database engine available.');
        return new Promise((resolve, reject) => {
            db.exec(sql, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    },

    close: async () => {
        if (mysqlPool) {
            await mysqlPool.end();
        }
        if (sqliteDb) {
            return new Promise((resolve, reject) => {
                sqliteDb.close((err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }
    },

    getActiveEngine: () => activeEngine
};

// Initialize schema on startup
const initSchema = async () => {
    await tryConnectMysql();

    if (activeEngine === 'mysql') {
        // Tables are already initialized in MySQL on AWS RDS; ensure users, events, registrations exist
        await query.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'student',
                department VARCHAR(255) DEFAULT 'Computer Science',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                date VARCHAR(50) NOT NULL,
                time VARCHAR(50) NOT NULL,
                location VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                capacity INT NOT NULL DEFAULT 50,
                available_seats INT NOT NULL DEFAULT 50,
                speaker VARCHAR(255) DEFAULT 'University Guest',
                organizer VARCHAR(255) DEFAULT 'Campus Event Committee',
                image_url TEXT,
                status VARCHAR(50) NOT NULL DEFAULT 'upcoming',
                postponed_note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS registrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                event_id INT NOT NULL,
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'confirmed',
                notes TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                UNIQUE KEY user_event_unique (user_id, event_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    } else {
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await query.exec(schemaSql);
        }
        try {
            await query.run("ALTER TABLE events ADD COLUMN status TEXT DEFAULT 'upcoming'");
        } catch (e) {}
        try {
            await query.run("ALTER TABLE events ADD COLUMN postponed_note TEXT");
        } catch (e) {}
    }
};

module.exports = {
    get db() {
        return getSqlite();
    },
    query,
    initSchema,
    tryConnectMysql
};
