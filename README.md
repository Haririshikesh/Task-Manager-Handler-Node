# 📋 Task Management API

This project is a **robust and well-structured backend API** for a Task Management system. It enables users to securely manage tasks with support for **email/password authentication**, **Google OAuth**, and full **CRUD operations**.

Designed for clarity and modularity, this project is also a valuable learning resource for mastering:
- Node.js backend development
- Sequelize ORM with PostgreSQL
- Authentication using Passport (Local + OAuth)
- Session + JWT handling
- API architecture and project structuring

---

## 🚀 Features

### 🔐 User Authentication:
- Signup and login via Email & Password.
- Google OAuth 2.0 integration for one-click login.
- Sessions and Cookies for persistent logins.
- JWT generation for API token-based access.
- Protected routes with middleware.

### ✅ Task Management:
- Create tasks with title, description, status, and due date.
- Get all tasks of a logged-in user.
- Get a task by ID.
- Update a task.
- Delete a task.

### 👤 User Profile Management:
- Update email or password securely.
- Passwords are hashed using `bcryptjs`.

### ⚙️ Environment Configuration:
- All secrets, credentials, and environment-specific configs in `.env`.

### 🧱 Structured Architecture:
- MVC architecture with separate folders for models, controllers, routes, middleware, and config.

---

## 🧰 Tech Stack

| Technology      | Purpose                            |
|-----------------|------------------------------------|
| Node.js + Express | Backend runtime + routing         |
| PostgreSQL       | Relational database               |
| Sequelize        | ORM for PostgreSQL                |
| Passport.js      | Authentication middleware         |
| bcryptjs         | Password hashing                  |
| jsonwebtoken     | JWT-based authentication          |
| express-session  | Session management                |
| cookie-parser    | Cookie handling                   |
| dotenv           | Environment variable loader       |
| cors             | Cross-origin resource sharing     |
| Jest + Axios     | Automated testing                 |

---

## 📁 Project File Structure

```bash
task-manager-api/
├── .env                   # Environment variables (secrets, DB credentials)
├── app.js                 # Main entry point, Express setup
├── config/
│   ├── config.js          # DB config, JWT secret, Google OAuth keys
│   └── passport.js        # Passport strategies (local, Google)
├── models/
│   ├── index.js           # Sequelize initialization
│   ├── User.js            # User model
│   └── Task.js            # Task model
├── controllers/
│   ├── authController.js  # Handles signup/login/oauth
│   ├── taskController.js  # Handles task CRUD
│   └── userController.js  # Profile update logic
├── routes/
│   ├── authRoutes.js      # /api/auth/
│   ├── taskRoutes.js      # /api/tasks/
│   └── userRoutes.js      # /api/users/
└── middleware/
    └── authMiddleware.js  # Route protection middleware


---

## ▶️ Getting Started

### 1. Prerequisites

- **Node.js** and **npm**: [Download Node.js](https://nodejs.org/)
- **PostgreSQL**: [Download PostgreSQL](https://www.postgresql.org/) + optionally use pgAdmin for DB GUI

### 2. Clone and Setup

```bash
git clone https://github.com/Haririshikesh/Task-Manager-Handler-Node.git
cd task-manager-api
npm install1234567890

### 3. Database Setup

Create a PostgreSQL database (e.g., `taskmg`) and ensure a user with necessary privileges exists.

### 4. Environment Variables

Create a `.env` file in the root directory with:

```env
DB_NAME=taskmg
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password
DB_HOST=localhost
DB_DIALECT=postgres
DB_PORT=5432

JWT_SECRET=supersecretjwtkeythatisverylongandrandom1234567890
SESSION_SECRET=anothersupersecretkeyforpassportsessions12345

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

CLIENT_URL=http://localhost:3000

NODE_ENV=development
PORT=5000
```

### 5. Run the Server

```bash
node app.js
# or
npm start
```

---

##  API Endpoints Reference

### Authentication (`/api/auth`)

| Method | Endpoint          | Description                              | Protected |
|--------|-------------------|------------------------------------------|-----------|
| POST   | /signup           | Register a new user                      | No        |
| POST   | /login            | Login with credentials                   | No        |
| GET    | /google           | Initiate Google OAuth                    | No        |
| GET    | /google/callback  | Google OAuth callback                    | No        |
| GET    | /me               | Get current user                         | Yes       |
| POST   | /logout           | Logout user                              | Yes       |

### Tasks (`/api/tasks`)

| Method | Endpoint | Description               | Protected |
|--------|----------|---------------------------|-----------|
| GET    | /        | Get all tasks             | Yes       |
| GET    | /:id     | Get task by ID            | Yes       |
| POST   | /        | Create new task           | Yes       |
| PUT    | /:id     | Update task by ID         | Yes       |
| DELETE | /:id     | Delete task by ID         | Yes       |

### User Profile (`/api/users`)

| Method | Endpoint     | Description              | Protected |
|--------|--------------|--------------------------|-----------|
| PUT    | /profile     | Update profile           | Yes       |

---

## Testing the API

### 1. Automated Tests (Jest & Axios)

```bash
npm test
```

### 2. Manual Testing with Postman

Use [Postman](https://www.postman.com/) to interactively test all endpoints.

---

##  Understanding Authentication

This project uses a hybrid approach with **Passport.js**, **sessions**, **cookies**, and **JWTs**:

- **Passport.js**: Authentication middleware that supports multiple strategies.
- **Sessions**: Server stores user session, identified via a cookie (`connect.sid`).
- **Cookies**: The client automatically sends `connect.sid` with requests.
- **serializeUser/deserializeUser**: Determine how user info is stored/retrieved from session.
- **JWTs**: Tokens given after login for client-side auth and stateless API access.

---

## Contributing

1. Fork the repo.
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE).
