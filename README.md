# Smart Task Manager Backend

A robust RESTful API backend for managing tasks, projects, and teams with intelligent task assignment and comprehensive activity tracking.

## 🎯 Problem Solved

This backend solves the challenge of managing complex team workflows by providing:
- **Smart Task Assignment**: Automatically assigns tasks based on team member capacity to prevent overload
- **Team Collaboration**: Organize work into projects and teams with clear member roles
- **Activity Tracking**: Complete audit trail of all actions (task updates, project changes, team modifications)
- **Workload Management**: Monitor team member capacity and identify overloaded members
- **Centralized Dashboard**: Real-time insights into projects, tasks, and team performance

## 🛠️ Technologies

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (Access & Refresh Tokens)
- **Validation**: Zod
- **Security**: bcryptjs for password hashing, role-based access control
- **Development**: ts-node-dev for hot reloading

## 📦 Features

- **User Management**: User registration, authentication, and profile management
- **Project Management**: Create, update, and manage projects with associated tasks
- **Task Management**: Tasks with priorities (Low, Medium, High) and statuses (Pending, In Progress, Done)
- **Team Management**: Create teams with members, assign roles, and track capacity
- **Activity Logging**: Track all system activities (task/project/team changes, member assignments)
- **Dashboard Analytics**: Overview of projects, tasks, team workload, and member capacity
- **Role-Based Access Control**: Secure endpoints with role-based permissions

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd smart-task-manager-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
BCRYPT_SALT_ROUND=10
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=7d
```

4. Start the development server
```bash
npm run dev
```

The server will run on `http://localhost:5000` (or your configured PORT).

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run lint` - Run ESLint

## 🔌 API Endpoints

Base URL: `/api/v1`

- `/auth` - Authentication (login, register, refresh token)
- `/user` - User management
- `/project` - Project CRUD operations
- `/team` - Team management
- `/activity` - Activity log retrieval
- `/dashboard` - Dashboard analytics

## 🏗️ Project Structure

```
src/
├── app/
│   ├── config/          # Environment configuration
│   ├── interface/       # TypeScript interfaces
│   ├── lib/             # Database connections
│   ├── middleware/      # Auth, validation, role-based protection
│   ├── modules/         # Feature modules (auth, user, project, team, activity, dashboard)
│   └── utils/           # JWT, cookies utilities
├── app.ts               # Express app configuration
├── routes.ts            # Route aggregation
└── server.ts            # Server entry point
```

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control middleware
- Input validation with Zod schemas
- CORS configuration for secure cross-origin requests

## 📄 License

ISC

