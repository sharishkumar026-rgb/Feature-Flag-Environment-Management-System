# Feature Flag & Environment Management System — Frontend

A React-based frontend for managing feature flags, environments, rollouts, user assignments, audit logs, analytics, and dashboards.

## Technology Stack

* React
* TypeScript
* Vite
* Tailwind CSS 3.4.19
* Axios
* React Router
* Recharts
* ESLint

## Project Structure

```text
frontend/
│
├── .env
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── README.md
│
├── public/
│
└── src/
    │
    ├── api/
    │   ├── analyticsApi.ts
    │   ├── assignmentApi.ts
    │   ├── auditLogApi.ts
    │   ├── authApi.ts
    │   ├── axios.ts
    │   ├── dashboardApi.ts
    │   ├── environmentApi.ts
    │   ├── featureFlagApi.ts
    │   ├── roleApi.ts
    │   ├── rolloutApi.ts
    │   └── userApi.ts
    │
    ├── components/
    │   ├── analytics/
    │   ├── assignments/
    │   ├── auditLogs/
    │   ├── auth/
    │   ├── common/
    │   ├── dashboard/
    │   ├── environments/
    │   ├── featureFlags/
    │   ├── layout/
    │   ├── roles/
    │   ├── rollouts/
    │   └── users/
    │
    ├── context/
    │   └── AuthContext.tsx
    │
    ├── pages/
    │   ├── Auth.tsx
    │   ├── Dashboard.tsx
    │   ├── analytics/
    │   ├── assignments/
    │   ├── auditLogs/
    │   ├── environments/
    │   ├── featureFlags/
    │   ├── roles/
    │   ├── rollouts/
    │   └── users/
    │
    ├── routes/
    │   └── AppRoutes.tsx
    │
    ├── types/
    │   ├── analytics.ts
    │   ├── assignment.ts
    │   ├── auditLog.ts
    │   ├── auth.ts
    │   ├── dashboard.ts
    │   ├── environment.ts
    │   ├── featureFlag.ts
    │   ├── role.ts
    │   ├── rollout.ts
    │   └── user.ts
    │
    ├── utils/
    │   ├── constants.ts
    │   ├── formatters.ts
    │   └── storage.ts
    │
    ├── App.tsx
    ├── index.css
    └── main.tsx
```

## Main Features

### Authentication

* User registration
* User login
* User logout
* Current user information
* JWT authentication
* Protected routes

### Users

* View users
* View user details
* Create users
* Update users
* Delete users
* Activate/deactivate users
* Manage user roles

### Roles

* View roles
* View role details
* Create roles
* Update roles
* Delete roles
* Activate/deactivate roles

### Feature Flags

* View feature flags
* View feature flag details
* Create feature flags
* Update feature flags
* Delete feature flags
* Enable feature flags
* Disable feature flags
* Evaluate feature flags

### Environments

* View environments
* View environment details
* Create environments
* Update environments
* Delete environments
* Activate/deactivate environments

### Rollouts

* View rollouts
* View rollout details
* Create rollouts
* Update rollouts
* Delete rollouts
* Manage rollout configuration

### User Assignments

* View assignments
* View assignment details
* Create assignments
* Update assignments
* Delete assignments
* Enable/disable assignments

### Audit Logs

* View audit logs
* View individual audit log details
* Track system actions
* Track users responsible for actions

### Analytics

* Analytics overview
* Feature analytics
* Rollout analytics
* Assignment analytics
* Environment analytics
* Charts and statistics

### Dashboard

* Feature statistics
* Environment statistics
* Rollout statistics
* Assignment statistics
* User statistics

## Environment Configuration

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

For sharing the project, use `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Do not store passwords, JWT secrets, database credentials, or other sensitive values in `.env.example`.

## Installation

Open a terminal in the frontend directory:

```powershell
cd C:\Assignment\feature-flag-system\frontend
```

Install dependencies:

```powershell
npm install
```

## Development

Start the Vite development server:

```powershell
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## Production Build

Create a production build:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## TypeScript Check

Run TypeScript without generating files:

```powershell
npx tsc --noEmit
```

## Tailwind CSS

This project uses Tailwind CSS 3.4.19.

The Tailwind configuration is located at:

```text
tailwind.config.js
```

PostCSS configuration:

```text
postcss.config.js
```

Tailwind directives are included in:

```text
src/index.css
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## API Configuration

Axios is configured to communicate with the FastAPI backend.

Default backend URL:

```text
http://localhost:8000/api
```

The API base URL is controlled through:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Backend Requirement

The frontend requires the FastAPI backend to be running.

Expected backend:

```text
http://localhost:8000
```

Expected API prefix:

```text
/api
```

For example:

```text
POST /api/auth/login
GET  /api/auth/me
GET  /api/users
GET  /api/roles
GET  /api/feature-flags
GET  /api/environments
GET  /api/rollouts
GET  /api/assignments
GET  /api/audit-logs
GET  /api/analytics/overview
GET  /api/dashboard
```

## Authentication Flow

The application uses JWT authentication.

Basic flow:

```text
User
 │
 ▼
Login Page
 │
 ▼
POST /api/auth/login
 │
 ▼
JWT Token
 │
 ▼
Browser Storage
 │
 ▼
Axios Authorization Header
 │
 ▼
Protected API
```

Protected pages require an authenticated user.

## Routing

Application routes are managed in:

```text
src/routes/AppRoutes.tsx
```

The application separates:

* Authentication routes
* Protected application routes
* Dashboard routes
* Management routes
* Analytics routes

## API Layer

All API communication is organized inside:

```text
src/api/
```

Examples:

```text
authApi.ts
userApi.ts
roleApi.ts
featureFlagApi.ts
environmentApi.ts
rolloutApi.ts
assignmentApi.ts
auditLogApi.ts
analyticsApi.ts
dashboardApi.ts
```

The common Axios configuration is located at:

```text
src/api/axios.ts
```

## Components

Reusable UI components are located inside:

```text
src/components/
```

Components are organized by feature to make the application easier to maintain.

For example:

```text
components/
├── users/
├── roles/
├── featureFlags/
├── environments/
├── rollouts/
├── assignments/
├── auditLogs/
├── analytics/
└── dashboard/
```

## Type Definitions

TypeScript interfaces and API response types are organized inside:

```text
src/types/
```

This keeps API and component type definitions reusable throughout the application.

## Utilities

Common utility functions are located inside:

```text
src/utils/
```

Examples:

```text
constants.ts
formatters.ts
storage.ts
```

## Troubleshooting

### Tailwind `Unknown at rule @tailwind`

Make sure Tailwind is installed:

```powershell
npm list tailwindcss
```

Expected:

```text
tailwindcss@3.4.19
```

If VS Code still reports the warning, install the **Tailwind CSS IntelliSense** extension or add:

```text
.vscode/settings.json
```

with:

```json
{
  "css.lint.unknownAtRules": "ignore"
}
```

### Missing npm package

Run:

```powershell
npm install
```

For a specific missing package:

```powershell
npm install <package-name>
```

### Vite module errors

If dependencies are corrupted:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

Then:

```powershell
npm run dev
```

### API connection errors

Verify that:

1. FastAPI backend is running.
2. Backend is running on port `8000`.
3. `.env` contains the correct API URL.
4. Vite was restarted after changing `.env`.

Example:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Development Commands

| Command            | Purpose                      |
| ------------------ | ---------------------------- |
| `npm install`      | Install dependencies         |
| `npm run dev`      | Start development server     |
| `npm run build`    | Build production application |
| `npm run preview`  | Preview production build     |
| `npx tsc --noEmit` | Check TypeScript             |
| `npm list`         | View installed packages      |

## Project Goal

The frontend provides a centralized interface for controlling feature flags and managing environments without requiring application redeployment.

The system allows administrators and authorized users to manage:

```text
Users
  ↓
Roles
  ↓
Feature Flags
  ↓
Environments
  ↓
Rollouts
  ↓
User Assignments
  ↓
Audit Logs
  ↓
Analytics
  ↓
Dashboard
```

## License

This project is developed as an assignment/project application.

