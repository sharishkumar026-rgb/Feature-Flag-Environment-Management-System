# Feature Flag & Environment Management System — Backend

Backend API for managing users, roles, feature flags, environments, rollouts, assignments, audit logs, analytics, and dashboard data.

## Tech Stack

* Python 3.12
* FastAPI
* SQLAlchemy
* Alembic
* MySQL
* Pydantic
* JWT Authentication
* Uvicorn

## Project Structure

```text
backend/
├── alembic/
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
│
├── app/
│   ├── api/
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── roles.py
│   │   ├── features_flag.py
│   │   ├── environments.py
│   │   ├── feature_rollouts.py
│   │   ├── user_assignment.py
│   │   ├── audit_logs.py
│   │   ├── analytics.py
│   │   └── dashboard.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   ├── jwt.py
│   │   ├── permissions.py
│   │   └── security.py
│   │
│   ├── database/
│   │   ├── base.py
│   │   └── database.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── feature_flag.py
│   │   ├── environment.py
│   │   ├── feature_rollout.py
│   │   ├── user_assignment.py
│   │   └── audit_log.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── feature_flag.py
│   │   ├── environment.py
│   │   ├── feature_rollout.py
│   │   ├── user_assignment.py
│   │   ├── audit_log.py
│   │   ├── analytics.py
│   │   └── dashboard.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── role_service.py
│   │   ├── feature_flag_service.py
│   │   ├── environment_service.py
│   │   ├── feature_rollout_service.py
│   │   ├── user_assignment_service.py
│   │   ├── audit_log_service.py
│   │   ├── analytics_service.py
│   │   └── dashboard_service.py
│   │
│   └── main.py
│
├── .env
├── alembic.ini
├── requirements.txt
└── README.md
```

## Setup

Create virtual environment:

```bash
python -m venv venv
```

Activate on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Database

Create MySQL database:

```sql
CREATE DATABASE feature_flag_system;
```

Configure `.env`:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/feature_flag_system
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run migrations:

```bash
alembic upgrade head
```

## Run Server

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API Documentation:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

## Main API Modules

```text
Authentication
Users
Roles
Feature Flags
Environments
Feature Rollouts
User Assignments
Audit Logs
Analytics
Dashboard
```

## Migration Commands

Create migration:

```bash
alembic revision --autogenerate -m "migration message"
```

Apply migration:

```bash
alembic upgrade head
```

Rollback:

```bash
alembic downgrade -1
```


