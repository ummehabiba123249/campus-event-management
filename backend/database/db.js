const path = require('path');
const fs = require('fs');

const DB_TYPE = (process.env.DB_TYPE || 'sqlite').toLowerCase();
let activeEngine = 'sqlite';

// SQLite Database Setup
const sqlite3 = require('sqlite3').verbose();
const SQLITE_PATH = process.env.DB_PATH || path.join(__dirname, 'campus_events.db');

const dbDir = path.dirname(SQLITE_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const sqliteDb = new sqlite3.Database(SQLITE_PATH, (err) => {
    if (!err) {
        sqliteDb.run('PRAGMA foreign_keys = ON');
    }
});

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

    // Do not attempt if password is still placeholder
    if (!process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'YOUR_AWS_RDS_PASSWORD') {
        console.log('ℹ️ AWS RDS MySQL configured. Awaiting real password in .env (falling back to SQLite).');
        activeEngine = 'sqlite';
        return false;
    }

    try {
        const sslOptions = {};
        const caPath = process.env.DB_SSL_CA
            ? path.resolve(__dirname, '..', '..', process.env.DB_SSL_CA)
            : path.join(__dirname, 'global-bundle.pem');

        if (fs.existsSync(caPath)) {
            sslOptions.ca = fs.readFileSync(caPath);
        }

        const dbName = process.env.DB_NAME || 'campus_events';

        // Connect and ensure database exists
        const rootConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'admin',
            password: process.env.DB_PASSWORD,
            ssl: Object.keys(sslOptions).length > 0 ? sslOptions : undefined,
            connectTimeout: 5000
        });

        await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await rootConn.end();

        mysqlPool = mysql.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'admin',
            password: process.env.DB_PASSWORD,
            database: dbName,
            ssl: Object.keys(sslOptions).length > 0 ? sslOptions : undefined,
            waitForConnections: true,
            connectionLimit: 10,
            connectTimeout: 5000
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
        return new Promise((resolve, reject) => {
            sqliteDb.all(sql, params, (err, rows) => {
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
        return new Promise((resolve, reject) => {
            sqliteDb.get(sql, params, (err, row) => {
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
        return new Promise((resolve, reject) => {
            sqliteDb.run(sql, params, function (err) {
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
        return new Promise((resolve, reject) => {
            sqliteDb.exec(sql, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    },

    close: async () => {
        if (mysqlPool) {
            await mysqlPool.end();
        }
        return new Promise((resolve, reject) => {
            sqliteDb.close((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    },

    getActiveEngine: () => activeEngine
};

// Initialize schema on startup
const initSchema = async () => {
    await tryConnectMysql();

    if (activeEngine === 'mysql') {
        const schemaPath = path.join(__dirname, 'schema.mysql.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await query.exec(schemaSql);
        }
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
    db: sqliteDb,
    query,
    initSchema,
    tryConnectMysql
};
