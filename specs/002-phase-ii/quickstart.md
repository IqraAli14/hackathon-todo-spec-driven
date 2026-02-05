# Quickstart Guide: Full-Stack Todo Web Application

**Feature**: 002-phase-ii
**Date**: 2026-02-05

This guide helps developers set up the local development environment and run the application.

## Prerequisites

- **Python**: 3.13+ ([python.org](https://python.org))
- **Node.js**: 20+ ([nodejs.org](https://nodejs.org))
- **Git**: Latest version
- **Neon Account**: Free tier at [neon.tech](https://neon.tech)

## Quick Start (TL;DR)

```bash
# Clone and enter the project
cd /workspaces/codespaces-blank

# Generate shared secret (use same value for both services)
openssl rand -base64 32
# Save this value - you'll need it for both .env files

# Frontend setup (includes Better Auth)
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with DATABASE_URL and BETTER_AUTH_SECRET
npx drizzle-kit push  # Create Better Auth tables
npm run dev

# In another terminal - Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with DATABASE_URL and BETTER_AUTH_SECRET (same as frontend!)
alembic upgrade head  # Create tasks table
uvicorn app.main:app --reload
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Detailed Setup

### 1. Database Setup (Neon PostgreSQL)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
   - Format: `postgresql://user:password@host/dbname?sslmode=require`
4. For async Python, modify to use asyncpg:
   - Change `postgresql://` to `postgresql+asyncpg://`

### 2. Frontend Setup (Better Auth)

Better Auth runs on the frontend and must be set up first to create user tables.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=<your-generated-secret>  # Same as backend
BETTER_AUTH_URL=http://localhost:3000

# Database (Better Auth uses this for user tables)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Initialize Better Auth database tables:

```bash
npx drizzle-kit push
```

Start the development server:

```bash
npm run dev
```

The frontend is now available at:
- App: [http://localhost:3000](http://localhost:3000)
- Auth API: [http://localhost:3000/api/auth](http://localhost:3000/api/auth)

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database (same as frontend - shared Neon instance)
DATABASE_URL=postgresql+asyncpg://user:password@host/dbname?sslmode=require

# Better Auth Secret (MUST match frontend)
BETTER_AUTH_SECRET=<your-generated-secret>

# CORS
CORS_ORIGINS=http://localhost:3000

# Environment
ENVIRONMENT=development
```

**Important**: The `BETTER_AUTH_SECRET` MUST be identical to the frontend `.env.local` value.

Run database migrations (creates tasks table only):

```bash
alembic upgrade head
```

Start the development server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API is now available at:
- API: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)
- Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health: [http://localhost:8000/health](http://localhost:8000/health)

---

## Development Workflow

### Running Both Services

**Terminal 1 - Backend**:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### Running Tests

**Backend Tests**:
```bash
cd backend
source venv/bin/activate
pytest
```

**Frontend Tests**:
```bash
cd frontend
npm test
```

### Code Formatting

**Backend**:
```bash
cd backend
ruff check --fix .
ruff format .
```

**Frontend**:
```bash
cd frontend
npm run lint
npm run format
```

---

## API Testing

### Using curl

```bash
# Health check
curl http://localhost:8000/health

# Register a user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Create a task (replace TOKEN with actual token from login)
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task"}'

# List tasks
curl http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer TOKEN"
```

### Using the Interactive Docs

1. Open [http://localhost:8000/docs](http://localhost:8000/docs)
2. Click "Authorize" button
3. Enter the access token from login
4. Try out any endpoint interactively

---

## Common Issues

### Database Connection Error

**Error**: `asyncpg.exceptions.InvalidCatalogNameError`

**Solution**: Ensure your Neon database exists and the connection string is correct. Check that you're using `postgresql+asyncpg://` prefix.

### CORS Error

**Error**: `Access to fetch blocked by CORS policy`

**Solution**: Add your frontend URL to `CORS_ORIGINS` in backend `.env`:
```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### JWT Token Expired

**Error**: `401 Unauthorized - Token has expired`

**Solution**: Use the refresh token endpoint to get a new access token, or log in again.

### Migration Error

**Error**: `alembic.util.exc.CommandError: Target database is not up to date`

**Solution**:
```bash
alembic upgrade head
```

### Port Already in Use

**Error**: `Address already in use`

**Solution**: Kill the process using the port or use a different port:
```bash
# Find process using port 8000
lsof -i :8000
# Kill it
kill -9 <PID>

# Or use different port
uvicorn app.main:app --reload --port 8001
```

---

## Environment Variables Reference

### Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | - | Neon PostgreSQL connection string (asyncpg format) |
| BETTER_AUTH_SECRET | Yes | - | Shared secret for JWT verification (must match frontend) |
| CORS_ORIGINS | No | * | Allowed CORS origins (comma-separated) |
| ENVIRONMENT | No | development | Environment name |

### Frontend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| BETTER_AUTH_SECRET | Yes | - | Secret for Better Auth (must match backend) |
| BETTER_AUTH_URL | Yes | - | URL where Better Auth is hosted |
| DATABASE_URL | Yes | - | Neon PostgreSQL connection string (for Better Auth) |
| NEXT_PUBLIC_API_URL | Yes | - | Backend API base URL |

### Shared Secret

Both services MUST use the same `BETTER_AUTH_SECRET` for JWT signing/verification.

Generate a secure secret:
```bash
openssl rand -base64 32
```

---

## Project Structure

```
/workspaces/codespaces-blank/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── config.py        # Settings management
│   │   ├── database.py      # DB connection
│   │   ├── models/          # SQLModel entities
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── api/             # Route handlers
│   │   └── services/        # Business logic
│   ├── tests/               # pytest tests
│   ├── alembic/             # DB migrations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
└── specs/
    └── 002-phase-ii/        # Feature documentation
```

---

## Deployment

See deployment guides:
- Backend: Deploy to Railway, Render, or Fly.io
- Frontend: Deploy to Vercel
- Database: Already hosted on Neon

Remember to set production environment variables on each platform.
