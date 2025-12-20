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

### Request/Response Examples

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "dueDate": "2025-12-31",
  "priority": "High",
  "assignedToId": "user_id_here"
}

Response: 201 Created
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "...",
    "title": "Complete project documentation",
    "status": "To Do",
    "priority": "High",
    ...
  }
}
```

#### Get Tasks with Filters
```http
GET /api/tasks?status=In Progress&priority=High&sortBy=dueDate&sortOrder=asc
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "tasks": [...],
    "total": 15,
    "page": 1,
    "totalPages": 1
  }
}
```

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

### Backend Layer Structure

```
Controllers (HTTP handlers)
      ↓
Services (Business Logic)
      ↓
Repositories (Data Access)
      ↓
Models (MongoDB Schemas)
```

**Example Flow:**
```
TaskController.createTask()
  → TaskService.createTask()      // Validate assignee exists
    → TaskRepository.create()     // Save to MongoDB
      → Task.save()
  → getTaskSocket().emitTaskCreated() // Broadcast to all clients
```

### Frontend Architecture

- **State Management:** TanStack Query (React Query) for server state
- **Real-Time:** Socket.io client with React Context
- **Routing:** React Router with protected routes
- **Forms:** React Hook Form + Zod validation
- **Styling:** Tailwind CSS

---

## 💡 Design Decisions

### Why MongoDB?

**Chosen because:**
- ✅ Flexible schema allows future extensions
- ✅ Excellent horizontal scaling for production workloads
- ✅ Native JSON support aligns with JavaScript/TypeScript ecosystem
- ✅ Mongoose provides robust TypeScript support and validation
- ✅ Rich querying capabilities for filtering and sorting

**Alternatives considered:**
- PostgreSQL: More rigid schema, better for complex relationships
- Trade-off: Chose flexibility over strict relational integrity

### JWT Authentication Strategy

**Implementation:**
```typescript
// Token Generation
const token = jwt.sign(
  { userId, email }, 
  JWT_SECRET, 
  { expiresIn: '7d' }
);

// Token Validation (Middleware)
const decoded = jwt.verify(token, JWT_SECRET);
req.user = { userId: decoded.userId, email: decoded.email };
```

**Why JWT?**
- ✅ Stateless authentication (no server-side session storage)
- ✅ Scales horizontally across multiple servers
- ✅ Reduced database lookups (user info in token payload)
- ✅ Easy integration with Socket.io for WebSocket authentication

### DTO Validation with Zod

**Why Zod over alternatives?**
```typescript
const CreateTaskDtoSchema = z.object({
  title: z.string().min(1).max(100),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().transform(val => new Date(val))
});
```

- ✅ Runtime type checking
- ✅ Single source of truth for validation
- ✅ Excellent TypeScript inference
- ✅ Clear, developer-friendly error messages

---

## 🔄 Socket.io Real-Time Integration

### How It Works

**1. Connection Setup (Backend)**
```typescript
// Authenticate WebSocket connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const decoded = verifyToken(token);
  if (!decoded) return next(new Error('Authentication error'));
  
  socket.user = { userId: decoded.userId, email: decoded.email };
  next();
});

// User joins personal room for targeted notifications
io.on('connection', (socket) => {
  socket.join(`user:${socket.user.userId}`);
});
```

**2. Event Emission (Backend)**
```typescript
// After task update in controller
const taskSocket = getTaskSocket();
taskSocket.emitTaskUpdated(task, oldAssigneeId);

// In TaskSocket class
emitTaskUpdated(task, oldAssigneeId) {
  // Broadcast to ALL connected clients
  io.emit('task:updated', task);
  
  // Send targeted notification if assignee changed
  if (task.assignedTo && task.assignedTo._id !== oldAssigneeId) {
    io.to(`user:${task.assignedTo._id}`).emit('task:assigned', {
      message: `You have been assigned to task: ${task.title}`,
      task
    });
  }
}
```

**3. Event Handling (Frontend)**
```typescript
// In React component/hook
useEffect(() => {
  if (!socket) return;
  
  const handleTaskUpdated = (task) => {
    // Invalidate React Query cache → triggers refetch
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'assigned'] });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'created'] });
  };
  
  socket.on('task:updated', handleTaskUpdated);
  return () => socket.off('task:updated', handleTaskUpdated);
}, [socket, queryClient]);
```

### Event Types

| Event | Direction | Purpose |
|-------|-----------|---------|
| `task:created` | Server → All Clients | Notify all users of new task |
| `task:updated` | Server → All Clients | Sync task changes across users |
| `task:deleted` | Server → All Clients | Remove task from all views |
| `task:assigned` | Server → Specific User | Notify user of new assignment |

### Real-Time Flow Example

```
User A updates task status
    ↓
PUT /api/tasks/:id
    ↓
TaskController.updateTask()
    ↓
TaskService.updateTask() (business logic)
    ↓
TaskRepository.update() (save to DB)
    ↓
taskSocket.emitTaskUpdated(task) ← Emit event
    ↓
Socket.io broadcasts to all clients
    ↓
User B's browser receives event
    ↓
React Query cache invalidated
    ↓
UI automatically refetches and updates
    ↓
User B sees changes instantly (< 1 second)
```

---

## ⚖️ Trade-offs & Assumptions

### Trade-offs Made

**1. JWT in localStorage vs httpOnly cookies**
- **Chosen:** localStorage
- **Reason:** Simpler implementation, easier debugging
- **Trade-off:** Less secure against XSS attacks
- **Production recommendation:** Use httpOnly cookies with CSRF protection

**2. Client-side vs Server-side rendering**
- **Chosen:** Client-side (React SPA)
- **Reason:** Better real-time UX, easier state management
- **Trade-off:** Slower initial page load, SEO limitations
- **Mitigation:** Could add Next.js for SSR in production

### Assumptions Made

**1. User & Task Management**
- ✅ Users can only assign tasks to registered users
- ✅ Task creators have full edit/delete permissions
- ✅ Task assignees can update status and priority
- ✅ Only task creator can delete a task

**2. Task States**
- ✅ Overdue = dueDate < current date AND status ≠ "Completed"
- ✅ Tasks default to "To Do" status when created
- ✅ Tasks default to "Medium" priority if not specified

**3. Real-Time Behavior**
- ✅ All connected users receive all task updates (no private tasks)
- ✅ Network disconnections handled gracefully with auto-reconnect
- ✅ Users can work offline; changes sync when reconnected (via React Query)

**4. Data Validation**
- ✅ Email uniqueness enforced at database level
- ✅ Task title limited to 100 characters
- ✅ Assignee must exist in database (validated before save)
- ✅ Dates validated to be proper ISO format

**5. Scalability**
- ✅ Current architecture supports ~1000 concurrent users per server instance
- ✅ Horizontal scaling achievable with Redis adapter for Socket.io
- ✅ Database indexed on frequently queried fields (creatorId, assignedToId, status)

---

## 🚢 Deployment

### Backend (Render)

```bash
# Build command
npm install && npm run build

# Start command
npm start

# Environment variables
PORT=5000
NODE_ENV=production
MONGO_URI=<mongodb-url>
JWT_SECRET=<strong-secret-key>
CLIENT_URL=<frontend-url>
```

### Frontend (Vercel)

```bash
# Environment variables
VITE_API_URL=<backend-url>
VITE_SOCKET_URL=<backend-url>
```

### Database (MongoDB Atlas)

1. Create MongoDB Atlas cluster
2. Configure network access
3. Get connection string and add to backend environment

---

## 📚 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Server state management
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Zod** - Validation
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - DTO validation

---

## 📂 Project Structure

```
collaborative-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── models/          # Mongoose schemas
│   │   ├── dtos/            # Validation schemas
│   │   ├── repositories/    # Data access layer
│   │   ├── services/        # Business logic
│   │   ├── controllers/     # HTTP handlers
│   │   ├── middleware/      # Auth, validation, errors
│   │   ├── routes/          # API routes
│   │   ├── sockets/         # Socket.io handlers
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Route pages
    │   ├── hooks/           # Custom hooks
    │   ├── services/        # API client
    │   ├── context/         # React contexts
    │   ├── types/           # TypeScript types
    │   └── App.tsx          # Root component
    └── package.json
```

---

**Built by Naveen Bugalia with ❤️ using React, TypeScript, Node.js, Express, MongoDB, and Socket.io**
