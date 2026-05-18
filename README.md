# MERN Auth RBAC Task Manager

A submission-ready MERN stack project for the Backend Developer Intern assignment. It includes JWT authentication, role-based access control, versioned REST APIs, validation, centralized errors, Swagger documentation, MongoDB schema design, and a simple React frontend.

## Tech Stack

- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: bcrypt password hashing, JWT access tokens
- Validation/Security: express-validator, helmet, cors, express-rate-limit, mongo-sanitize
- Docs: Swagger UI at `/api/docs`
- Frontend: React.js with Vite

## Features

- Register and login users
- Password hashing with bcrypt
- JWT protected routes
- Roles: `user` and `admin`
- Task CRUD APIs
- Admin-only route to view all users
- API versioning under `/api/v1`
- Validation and sanitized inputs
- Centralized error handling
- Basic React UI for auth, dashboard, CRUD, and API messages

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create backend environment file:

```bash
cp server/.env.example server/.env
```

3. Update `server/.env` if needed:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_auth_rbac_tasks
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

4. Start MongoDB locally, then run both apps:

```bash
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- Swagger docs: `http://localhost:5000/api/docs`

## API Overview

Base URL: `http://localhost:5000/api/v1`

### Auth

- `POST /auth/register` - register user
- `POST /auth/login` - login user
- `GET /auth/me` - current logged-in user

### Tasks

- `GET /tasks` - list current user's tasks
- `POST /tasks` - create task
- `GET /tasks/:id` - get one task
- `PUT /tasks/:id` - update task
- `DELETE /tasks/:id` - delete task

### Admin

- `GET /admin/users` - list all users, admin only

## Database Schema

### User

```js
{
  name: String,
  email: String,
  password: String,
  role: "user" | "admin",
  timestamps: true
}
```

### Task

```js
{
  title: String,
  description: String,
  status: "todo" | "in-progress" | "done",
  priority: "low" | "medium" | "high",
  dueDate: Date,
  owner: ObjectId(User),
  timestamps: true
}
```

## Create an Admin User

For demo purposes, register normally, then update the role in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Security Notes

- Passwords are hashed before storage.
- JWT tokens are required for protected APIs.
- Admin APIs are protected by role middleware.
- Helmet adds common secure headers.
- Rate limiting reduces brute-force risk.
- Request validation rejects malformed input.
- Mongo sanitize removes unsafe MongoDB operator input.

## Scalability Note

The project uses a modular structure so new resources can be added as separate models, controllers, routes, and validators. For production, use managed MongoDB, Redis caching for frequent reads, centralized logging, Docker-based deployment, horizontal scaling behind a load balancer, refresh tokens with rotation, and separate services for auth, notifications, and analytics once traffic grows.

## Submission Checklist

- Push this repository to GitHub.
- Add screenshots or a short demo video if possible.
- Include the Swagger docs URL in the README.
- Submit the GitHub link through the Google Form.
