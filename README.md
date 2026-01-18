# 🧑‍💻 Collaborative Task Manager

A production-ready, full-stack task management application with real-time collaboration features. Built with React, TypeScript, Node.js, Express, MongoDB, and Socket.io.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 🔄 **Real-Time Collaboration** - Instant task updates across all users via Socket.io
- ✅ **Complete CRUD Operations** - Create, read, update, and delete tasks
- 🎯 **Advanced Filtering** - Filter by status/priority, sort by date/priority
- 📊 **User Dashboard** - Personal views for assigned, created, and overdue tasks
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS
- 🔔 **Push Notifications** - In-app and browser notifications for task assignments

---

## 🚀 Quick Start

### Prerequisites

- Node.js and npm
- MongoDB
- Git

### 1. Backend Setup

```bash
git clone <your-repo-url>
cd collaborative-task-manager-backend

# Install dependencies
npm install

# Create environment file

# Edit .env with your configuration:
# PORT=5000
# MONGO_URI= <mongodb-url>
# JWT_SECRET=secret-key
# CLIENT_URL= <frontend-url>

# Run development server
npm run dev

# Server will start at http://localhost:5000
```

### 2. Frontend Setup

```bash
git clone <your-repo-url>
cd collaborative-task-manager-frontend

# Install dependencies
npm install

# Create environment file

# Edit .env with your configuration:
# VITE_API_URL=http://localhost:5000
# VITE_SOCKET_URL=http://localhost:5000

# Run development server
npm run dev

```

### 3. Access Application

Open your browser and navigate to `http://localhost:5173`

**Default Flow:**
1. Register a new account
2. Login with your credentials
3. Create your first task
4. Test real-time updates by opening a second browser window with a different user

---

## 📡 API Documentation

**Base URL:** `http://localhost:5000/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get current user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |
| GET | `/auth/users` | Get all users (for assignment) | Yes |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/tasks` | Create new task | Yes |
| GET | `/tasks` | Get all tasks (with filters) | Yes |
| GET | `/tasks/:id` | Get task by ID | Yes |
| GET | `/tasks/created` | Get tasks created by user | Yes |
| GET | `/tasks/assigned` | Get tasks assigned to user | Yes |
| GET | `/tasks/overdue` | Get overdue tasks | Yes |
| PUT | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task (creator only) | Yes |

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐
│                 │  HTTP   │                 │
│  React Frontend │◄───────►│  Express API    │
│  (Port 5173)    │         │  (Port 5000)    │
│                 │         │                 │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │ WebSocket                 │
         │ (Socket.io)               │
         └───────────┬───────────────┘
                     │
              ┌──────▼──────┐
              │   MongoDB   │
              │  Database   │
              └─────────────┘
```

---

**Built by Naveen Bugalia with ❤️ using React, TypeScript, Node.js, Express, MongoDB, and Socket.io**
