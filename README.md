# 🏨 Hotel Management System — MEAN Stack

Multi-owner Hotel Management System built with **MongoDB**, **Express**, **Angular 19**, and **Node.js** using clean architecture principles.

---

## 📁 Project Structure

```
HotemManagement/
├── backend/                          # Express REST API
│   └── src/
│       ├── config/db.js              # MongoDB connection
│       ├── models/                   # Mongoose schemas (code-first)
│       │   ├── Owner.js
│       │   ├── Hotel.js
│       │   ├── Employee.js
│       │   └── Room.js
│       ├── services/                 # Business logic layer
│       │   ├── ownerService.js
│       │   ├── hotelService.js
│       │   ├── employeeService.js
│       │   └── roomService.js
│       ├── controllers/              # Thin req/res handlers
│       ├── routes/                   # Route definitions
│       ├── middlewares/              # Auth, validation, error handler
│       ├── utils/AppError.js         # Custom error class
│       ├── app.js                    # Express app setup
│       └── server.js                 # Entry point
│
├── frontend/                         # Angular 19 SPA
│   └── src/app/
│       ├── core/
│       │   ├── services/             # AuthService, HotelService
│       │   └── interceptors/         # JWT auth interceptor
│       ├── features/
│       │   ├── auth/                 # Login & Register
│       │   ├── hotels/               # Hotel list CRUD
│       │   ├── employees/            # Placeholder
│       │   └── rooms/                # Placeholder
│       └── shared/                   # Future shared components
│
└── README.md
```

---

## 🚀 Quick Start

### Backend

```bash
cd backend
cp .env.example .env       # Edit with your MongoDB Atlas URI
npm install
npm start                  # → http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npx ng serve               # → http://localhost:4200
```

---

## 🔁 Request Flow

```
HTTP Request
     │
     ▼
  Route          (routes/*.routes.js)      — maps URL → middleware chain → controller
     │
     ▼
  Middleware      (middlewares/auth.js)     — verifies JWT, attaches req.owner
     │
     ▼
  Controller     (controllers/*.js)        — parses req, calls service, sends res
     │
     ▼
  Service        (services/*.js)           — ALL business/DB logic lives here
     │
     ▼
  Model          (models/*.js)             — Mongoose schema, virtuals, hooks
     │
     ▼
  MongoDB        — collections created automatically (code-first)
```

**Key rule:** Controllers never touch Mongoose directly. Services never touch `req`/`res`.

---

## 🗄️ Code-First Approach

With Mongoose's code-first approach, you define schemas in JavaScript — MongoDB collections are created **automatically** the first time a document is inserted. No migrations or manual DB setup required.

```javascript
// models/Hotel.js → creates "hotels" collection on first .create()
const hotelSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  owner:   { type: ObjectId, ref: 'Owner', index: true },
}, { timestamps: true });
```

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register owner |
| POST | `/api/auth/login` | No | Login, receive JWT |
| GET | `/api/auth/profile` | Yes | Get owner profile |
| GET/POST | `/api/hotels` | Yes | List / Create hotels |
| GET/PUT/DELETE | `/api/hotels/:id` | Yes | Hotel CRUD |
| GET/POST | `/api/hotels/:hotelId/employees` | Yes | List / Add employees |
| GET/PUT/DELETE | `/api/hotels/:hotelId/employees/:id` | Yes | Employee CRUD |
| GET/POST | `/api/hotels/:hotelId/rooms` | Yes | List / Add rooms |
| GET/PUT/DELETE | `/api/hotels/:hotelId/rooms/:id` | Yes | Room CRUD |

---

## 🛡️ Architecture Decisions

- **Service layer pattern** — keeps business logic testable and controllers thin
- **Ownership verification** — every hotel/employee/room operation verifies the JWT owner matches the hotel's owner
- **Centralized error handling** — all errors flow through `errorHandler.js` middleware
- **Functional HTTP interceptor** — Angular 15+ style, auto-attaches JWT to every request
- **Standalone components** — no NgModules needed, tree-shakeable and lazy-loaded
- **Signals** — Angular 19 reactive primitives for auth state management
