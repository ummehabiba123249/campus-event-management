# REST API Documentation

Campus Event Management System provides RESTful APIs for event management, student registrations, user authentication, and system health checks.

**Base URL**: `http://localhost:5000/api`

---

## 1. Events Endpoints

### 1.1 Get All Events
- **Method**: `GET`
- **Endpoint**: `/api/events`
- **Query Parameters**:
  - `search` *(optional)*: Search string matching title, description, or venue (e.g. `?search=AI`)
  - `category` *(optional)*: Filter by event category (e.g. `?category=Workshop`)
- **Response** `200 OK`:
```json
{
  "success": true,
  "count": 6,
  "events": [
    {
      "id": 1,
      "title": "AI & Machine Learning Hands-on Workshop",
      "description": "A comprehensive full-day workshop covering Deep Learning...",
      "date": "2026-11-15",
      "time": "10:00 AM - 04:00 PM",
      "location": "Main Auditorium Hall A, UOL Campus",
      "category": "Workshop",
      "capacity": 80,
      "available_seats": 76,
      "speaker": "Dr. Ahmad Raza",
      "organizer": "Department of Computer Science",
      "image_url": "https://images.unsplash.com/...",
      "registered_count": 4
    }
  ]
}
```

### 1.2 Get Single Event by ID
- **Method**: `GET`
- **Endpoint**: `/api/events/:id`
- **Response** `200 OK`:
```json
{
  "success": true,
  "event": {
    "id": 1,
    "title": "AI & Machine Learning Hands-on Workshop",
    "description": "...",
    "date": "2026-11-15",
    "time": "10:00 AM - 04:00 PM",
    "location": "Main Auditorium Hall A",
    "category": "Workshop",
    "capacity": 80,
    "available_seats": 76,
    "registered_count": 4
  }
}
```

### 1.3 Create Event
- **Method**: `POST`
- **Endpoint**: `/api/events`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "Cybersecurity & Ethical Hacking Bootcamp",
  "description": "Intensive hands-on training on network defense.",
  "date": "2026-11-25",
  "time": "09:00 AM - 04:00 PM",
  "location": "CS Lab 5, UOL",
  "category": "Workshop",
  "capacity": 45,
  "speaker": "Engr. Usman Qazi",
  "organizer": "Cyber Security Society"
}
```
- **Response** `201 Created`:
```json
{
  "success": true,
  "message": "Campus event created successfully!",
  "event": {
    "id": 7,
    "title": "Cybersecurity & Ethical Hacking Bootcamp",
    "capacity": 45,
    "available_seats": 45
  }
}
```

### 1.4 Update Event
- **Method**: `PUT`
- **Endpoint**: `/api/events/:id`
- **Request Body**:
```json
{
  "capacity": 60,
  "location": "Main Auditorium Hall C"
}
```
- **Response** `200 OK`:
```json
{
  "success": true,
  "message": "Event updated successfully!",
  "event": { "id": 1, "capacity": 60 }
}
```

### 1.5 Delete Event
- **Method**: `DELETE`
- **Endpoint**: `/api/events/:id`
- **Response** `200 OK`:
```json
{
  "success": true,
  "message": "Event #1 deleted successfully."
}
```

---

## 2. Student Registration Endpoints

### 2.1 Register for Event
- **Method**: `POST`
- **Endpoint**: `/api/register` (or `/api/registrations`)
- **Request Body**:
```json
{
  "event_id": 1,
  "student_name": "Umme Habiba",
  "student_email": "70176821@student.uol.edu.pk",
  "student_roll_no": "70176821",
  "department": "Computer Science & IT",
  "notes": "Looking forward to PyTorch module"
}
```
- **Response** `201 Created`:
```json
{
  "success": true,
  "message": "Successfully registered for the event!",
  "registration": {
    "id": 9,
    "user_id": 1,
    "event_id": 1,
    "status": "confirmed",
    "registration_date": "2026-10-22 18:00:00"
  }
}
```

### 2.2 Get All Registrations
- **Method**: `GET`
- **Endpoint**: `/api/registrations`
- **Response** `200 OK`:
```json
{
  "success": true,
  "count": 8,
  "registrations": [ ... ]
}
```

### 2.3 Cancel Registration
- **Method**: `DELETE`
- **Endpoint**: `/api/registrations/:id`
- **Response** `200 OK`:
```json
{
  "success": true,
  "message": "Registration cancelled successfully.",
  "registration": {
    "id": 9,
    "status": "cancelled"
  }
}
```

---

## 3. Authentication Endpoints

### 3.1 Student / Admin Login
- **Method**: `POST`
- **Endpoint**: `/api/login` (or `/api/auth/login`)
- **Request Body**:
```json
{
  "email": "70176821@student.uol.edu.pk",
  "password": "student123"
}
```
- **Response** `200 OK`:
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "name": "Umme Habiba",
    "email": "70176821@student.uol.edu.pk",
    "role": "admin",
    "department": "Computer Science & IT"
  }
}
```

### 3.2 User Signup
- **Method**: `POST`
- **Endpoint**: `/api/signup` (or `/api/auth/signup`)
- **Request Body**:
```json
{
  "name": "Ahmad Ali",
  "email": "ahmad.ali@student.uol.edu.pk",
  "password": "password123",
  "department": "Software Engineering"
}
```
- **Response** `201 Created`:
```json
{
  "success": true,
  "message": "User registered successfully!",
  "token": "eyJhbGciOi...",
  "user": {
    "id": 6,
    "name": "Ahmad Ali",
    "email": "ahmad.ali@student.uol.edu.pk",
    "role": "student"
  }
}
```

---

## 4. System Health & Stats

### 4.1 Health Check
- **Method**: `GET`
- **Endpoint**: `/api/health`
- **Response** `200 OK`:
```json
{
  "status": "UP",
  "service": "Campus Event Management System API",
  "team": [
    { "role": "Student 1 - Team Lead", "name": "Umme Habiba", "email": "70176821@student.uol.edu.pk" },
    { "role": "Student 2 - Front-End Developer 1", "name": "Zoha Khalid", "email": "zoha.khalid@student.uol.edu.pk" },
    { "role": "Student 3 - Front-End Developer 2", "name": "Umme Habiba", "email": "70176821@student.uol.edu.pk" },
    { "role": "Student 4 - Back-End Developer 1", "name": "Laiba Aamir", "email": "laiba.aamir@student.uol.edu.pk" },
    { "role": "Student 5 - Back-End Developer 2 / DB & Testing", "name": "Laiba Aamir", "email": "laiba.aamir@student.uol.edu.pk" }
  ]
}
```
