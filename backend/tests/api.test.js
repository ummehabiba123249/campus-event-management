// Automated API & Database Testing Suite
// Verifies all required endpoints and database operations (Insert, Select, Update, Delete)

const http = require('http');
const app = require('../server');
const { query } = require('../database/db');

let server;
const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}`;

// Helper function to make HTTP requests
function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, headers: res.headers, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, headers: res.headers, raw: data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

// Test runner
async function runTests() {
    console.log('====================================================');
    console.log('🧪 Starting Campus Event Management System API Tests');
    console.log('====================================================\n');

    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
        if (condition) {
            console.log(`  ✅ PASS: ${message}`);
            passed++;
        } else {
            console.error(`  ❌ FAIL: ${message}`);
            failed++;
        }
    }

    try {
        // Start test server
        await new Promise((resolve) => {
            server = app.listen(PORT, () => {
                console.log(`📡 Test server running on port ${PORT}`);
                resolve();
            });
        });

        // 1. Health Check Test
        console.log('\n--- 1. Testing Health & Diagnostics API ---');
        const healthRes = await request('GET', '/api/health');
        assert(healthRes.status === 200, 'GET /api/health returns status 200');
        assert(healthRes.body.status === 'UP', 'Service status is UP');
        assert(Array.isArray(healthRes.body.team), 'Team structure is populated');

        // 2. Authentication: Login
        console.log('\n--- 2. Testing Authentication (POST /api/login) ---');
        const loginRes = await request('POST', '/api/login', {
            email: '70176821@student.uol.edu.pk',
            password: 'student123'
        });
        assert(loginRes.status === 200, 'Login with valid credentials succeeds');
        assert(loginRes.body.token !== undefined, 'Login returns JWT token');
        const authToken = loginRes.body.token;

        // Login with invalid credentials
        const badLoginRes = await request('POST', '/api/login', {
            email: '70176821@student.uol.edu.pk',
            password: 'wrongpassword'
        });
        assert(badLoginRes.status === 401, 'Login with invalid password rejected (401)');

        // 3. Authentication: Signup
        console.log('\n--- 3. Testing User Signup (POST /api/signup) ---');
        const testUserEmail = `test.student.${Date.now()}@student.uol.edu.pk`;
        const signupRes = await request('POST', '/api/signup', {
            name: 'Test Student',
            email: testUserEmail,
            password: 'password123',
            role: 'student',
            department: 'Computer Science'
        });
        assert(signupRes.status === 201, 'Signup creates new user successfully (201)');
        assert(signupRes.body.user.email === testUserEmail, 'Signup returns user object with email');

        // Duplicate signup rejection
        const dupSignupRes = await request('POST', '/api/signup', {
            name: 'Duplicate Student',
            email: testUserEmail,
            password: 'password123'
        });
        assert(dupSignupRes.status === 409, 'Duplicate signup rejected (409 Conflict)');

        // 4. Events: GET /api/events
        console.log('\n--- 4. Testing Events Retrieval (GET /api/events) ---');
        const eventsRes = await request('GET', '/api/events');
        assert(eventsRes.status === 200, 'GET /api/events returns status 200');
        assert(Array.isArray(eventsRes.body.events), 'Returns array of events');
        assert(eventsRes.body.events.length > 0, 'Database contains seeded events');

        // Search events
        const searchRes = await request('GET', '/api/events?search=Workshop');
        assert(searchRes.status === 200, 'GET /api/events?search=Workshop succeeds');
        assert(searchRes.body.events.some(e => e.title.includes('Workshop')), 'Search filters correctly by keyword');

        // Filter events by category
        const filterRes = await request('GET', '/api/events?category=Sports');
        assert(filterRes.status === 200, 'GET /api/events?category=Sports succeeds');
        assert(filterRes.body.events.every(e => e.category === 'Sports'), 'Category filter returns only Sports events');

        // 5. Events: POST /api/events (Create)
        console.log('\n--- 5. Testing Event Creation (POST /api/events) ---');
        const newEventData = {
            title: 'Automated Test Event ' + Date.now(),
            description: 'This is a test event created by the automated test suite.',
            date: '2026-12-25',
            time: '11:00 AM',
            location: 'Auditorium Lab 1',
            category: 'Seminar',
            capacity: 50,
            speaker: 'Dr. Automated Tester',
            organizer: 'Quality Assurance Society'
        };
        const createEventRes = await request('POST', '/api/events', newEventData, authToken);
        assert(createEventRes.status === 201, 'POST /api/events creates event (201)');
        assert(createEventRes.body.event.title === newEventData.title, 'Created event has correct title');
        const createdEventId = createEventRes.body.event.id;

        // 6. Events: GET /api/events/:id
        console.log('\n--- 6. Testing Event Details (GET /api/events/:id) ---');
        const singleEventRes = await request('GET', `/api/events/${createdEventId}`);
        assert(singleEventRes.status === 200, 'GET /api/events/:id returns status 200');
        assert(singleEventRes.body.event.id === createdEventId, 'Returned event ID matches');

        // 7. Events: PUT /api/events/:id (Update)
        console.log('\n--- 7. Testing Event Update (PUT /api/events/:id) ---');
        const updateRes = await request('PUT', `/api/events/${createdEventId}`, {
            title: 'Updated Test Event Title',
            capacity: 75
        }, authToken);
        assert(updateRes.status === 200, 'PUT /api/events/:id updates event (200)');
        assert(updateRes.body.event.title === 'Updated Test Event Title', 'Title was updated successfully');
        assert(updateRes.body.event.capacity === 75, 'Capacity was updated successfully');

        // 8. Registrations: POST /api/register
        console.log('\n--- 8. Testing Student Registration (POST /api/register) ---');
        const regRes = await request('POST', '/api/register', {
            event_id: createdEventId,
            student_name: 'Test Student',
            student_email: testUserEmail,
            student_roll_no: 'CS-2026-999',
            notes: 'Eager to attend'
        }, authToken);
        assert(regRes.status === 201, 'POST /api/register successfully registers student (201)');
        assert(regRes.body.registration.event_id === createdEventId, 'Registration links to correct event');
        const createdRegId = regRes.body.registration.id;

        // Verify available seats decreased
        const postRegEvent = await request('GET', `/api/events/${createdEventId}`);
        assert(postRegEvent.body.event.available_seats === 74, 'Available seats decremented by 1');

        // Prevent duplicate registration
        const dupRegRes = await request('POST', '/api/register', {
            event_id: createdEventId,
            student_email: testUserEmail
        }, authToken);
        assert(dupRegRes.status === 400, 'Duplicate registration is rejected (400)');

        // 9. Registrations: GET /api/registrations
        console.log('\n--- 9. Testing Registration Listing (GET /api/registrations) ---');
        const listRegRes = await request('GET', '/api/registrations');
        assert(listRegRes.status === 200, 'GET /api/registrations returns 200');
        assert(Array.isArray(listRegRes.body.registrations), 'Returns registrations array');

        // 10. Registrations: DELETE /api/registrations/:id (Cancel)
        console.log('\n--- 10. Testing Registration Cancellation (DELETE /api/registrations/:id) ---');
        const cancelRegRes = await request('DELETE', `/api/registrations/${createdRegId}`, null, authToken);
        assert(cancelRegRes.status === 200, 'DELETE /api/registrations/:id cancels registration (200)');

        // Verify seats incremented back
        const postCancelEvent = await request('GET', `/api/events/${createdEventId}`);
        assert(postCancelEvent.body.event.available_seats === 75, 'Available seats incremented back on cancel');

        // 11. Events: DELETE /api/events/:id
        console.log('\n--- 11. Testing Event Deletion (DELETE /api/events/:id) ---');
        const deleteEventRes = await request('DELETE', `/api/events/${createdEventId}`, null, authToken);
        assert(deleteEventRes.status === 200, 'DELETE /api/events/:id deletes event (200)');

        const verifyDeleteRes = await request('GET', `/api/events/${createdEventId}`);
        assert(verifyDeleteRes.status === 404, 'Deleted event is no longer accessible (404)');

        // 12. Database Operations (Direct verification: Insert, Select, Update, Delete)
        console.log('\n--- 12. Database Direct Verification (Insert, Select, Update, Delete) ---');
        // Insert
        const ins = await query.run('INSERT INTO events (title, description, date, time, location, category) VALUES (?, ?, ?, ?, ?, ?)',
            ['DB Test Event', 'Testing DB directly', '2026-11-11', '10:00', 'Room 1', 'Workshop']);
        assert(ins.lastID > 0, 'Database INSERT operation verified');

        // Select
        const sel = await query.get('SELECT * FROM events WHERE id = ?', [ins.lastID]);
        assert(sel && sel.title === 'DB Test Event', 'Database SELECT operation verified');

        // Update
        const upd = await query.run('UPDATE events SET title = ? WHERE id = ?', ['DB Test Updated', ins.lastID]);
        assert(upd.changes > 0, 'Database UPDATE operation verified');

        // Delete
        const del = await query.run('DELETE FROM events WHERE id = ?', [ins.lastID]);
        assert(del.changes > 0, 'Database DELETE operation verified');

    } catch (err) {
        console.error('Fatal test error:', err);
        failed++;
    } finally {
        if (server) {
            server.close();
        }
        console.log('\n====================================================');
        console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
        console.log('====================================================');
        process.exit(failed > 0 ? 1 : 0);
    }
}

runTests();
