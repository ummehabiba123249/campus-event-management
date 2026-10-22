# System Architecture Documentation

The **Campus Event Management System** is a 3-tier Full-Stack Web Application built for high responsiveness, zero-configuration installation, and clean separation of concerns.

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|   HTML5 + CSS3 + Vanilla JavaScript (Modular ES6+)                     |
|                                                                         |
|   [Navbar]  [Hero & Stats]  [Search & Category Filter]  [Event Cards]   |
|   [Event Details Modal]     [Registration Modal]        [Admin Portal]  |
+-------------------------------------------------------------------------+
                                    |
                           HTTP / REST API (JSON)
                                    |
+-------------------------------------------------------------------------+
|                            APPLICATION LAYER                            |
|   Node.js + Express.js Framework (Port 5000)                            |
|                                                                         |
|   +-------------------+  +--------------------+  +------------------+   |
|   |   Auth Router     |  |   Events Router    |  |  Registrations   |   |
|   |   & JWT Middleware|  |   & Controllers    |  |  & Controllers   |   |
|   +-------------------+  +--------------------+  +------------------+   |
+-------------------------------------------------------------------------+
                                    |
                            Embedded Driver
                                    |
+-------------------------------------------------------------------------+
|                                DATA LAYER                               |
|   SQLite Relational Database (campus_events.db)                         |
|                                                                         |
|   [users table]        [events table]        [registrations table]      |
+-------------------------------------------------------------------------+
```

## Architectural Highlights
1. **Decoupled Architecture**: Front-end uses asynchronous `fetch()` calls to communicate with the REST API.
2. **Server-Side Validation**: Ensures data integrity for event dates, capacities, and unique registrations.
3. **Database Transactions & Seat Counter**: Available seats dynamically synchronize upon every student registration or cancellation.
4. **JWT Session Management**: Lightweight and stateless authentication stored in the browser's `localStorage`.
