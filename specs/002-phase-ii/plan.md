# Implementation Plan: Full-Stack Todo Web Application

**Branch**: `002-phase-ii` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-phase-ii/spec.md`

## Summary

Evolve the Phase I in-memory console Todo application into a full-stack, multi-user web application with persistent storage. The system consists of a Next.js frontend (App Router), Python FastAPI backend, and Neon PostgreSQL database. Users register and authenticate via JWT tokens, then manage their personal task lists through a responsive web interface.

## Technical Context

**Language/Version**: Python 3.13+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: FastAPI, SQLModel, Next.js 14+, Better Auth
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (backend), Jest/React Testing Library (frontend)
**Target Platform**: Web browsers (desktop and mobile)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: <2s page load, <1s API response, 100 concurrent users
**Constraints**: Stateless backend, JWT auth, user data isolation
**Scale/Scope**: MVP for hackathon, ~5 screens, 2 entities

## Constitution Check

*GATE: Must pass before implementation. All items verified against Constitution v2.0.0*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | Spec exists at `specs/002-phase-ii/spec.md` |
| II. No Manual Code Writing | ✅ PASS | Implementation via `/sp.implement` only |
| III. Python Best Practices | ✅ PASS | FastAPI + SQLModel + async + type hints |
| IV. Simplicity Over Cleverness | ✅ PASS | Minimal abstractions, direct approach |
| V. TypeScript/React Best Practices | ✅ PASS | Next.js App Router + strict TS |
| VI. Clear Acceptance Criteria | ✅ PASS | 7 user stories with Given-When-Then |
| VII. RESTful API Design | ✅ PASS | REST endpoints per constitution |
| VIII. Phase II Scope | ✅ PASS | Only allowed technologies used |
| IX. Hackathon II Compliance | ✅ PASS | PHRs, spec-driven, auditable |
| X. Service Separation | ✅ PASS | Frontend/backend separate projects |
| XI. JWT Authentication | ✅ PASS | Better Auth + access/refresh tokens |
| XII. Multi-User Data Isolation | ✅ PASS | user_id scoping on all queries |

## Project Structure

### Documentation (this feature)

```text
specs/002-phase-ii/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology research
├── data-model.md        # Entity definitions
├── quickstart.md        # Developer setup guide
├── contracts/           # API contracts
│   ├── auth.md          # Authentication endpoints
│   └── tasks.md         # Task CRUD endpoints
├── checklists/
│   └── requirements.md  # Spec validation checklist
└── tasks.md             # Implementation tasks (from /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry
│   ├── config.py            # Environment configuration
│   ├── database.py          # Database connection
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task SQLModel only (users managed by Better Auth)
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── task.py          # Task request/response schemas
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # JWT verification dependency
│   │   └── tasks.py         # Task CRUD endpoints
│   └── services/
│       ├── __init__.py
│       └── task.py          # Task business logic
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Test fixtures
│   └── test_tasks.py        # Task endpoint tests
├── alembic/                 # Database migrations (tasks table only)
│   └── versions/
├── alembic.ini
├── pyproject.toml
├── requirements.txt
└── .env.example

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with AuthProvider
│   │   ├── page.tsx         # Landing/redirect
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── route.ts  # Better Auth API routes
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx      # Better Auth sign-in page
│   │   │   └── sign-up/
│   │   │       └── page.tsx      # Better Auth sign-up page
│   │   └── (protected)/
│   │       ├── layout.tsx        # Auth check wrapper
│   │       └── tasks/
│   │           └── page.tsx      # Task list page
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   └── auth/
│   │       ├── SignInForm.tsx    # Better Auth sign-in
│   │       └── SignUpForm.tsx    # Better Auth sign-up
│   ├── lib/
│   │   ├── auth.ts          # Better Auth client configuration
│   │   ├── auth-client.ts   # Better Auth React hooks
│   │   ├── api.ts           # Task API client (with JWT)
│   │   └── validations.ts   # Form validations
│   └── types/
│       └── index.ts         # TypeScript interfaces
├── public/
├── auth.ts                  # Better Auth server configuration
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── drizzle.config.ts        # Drizzle ORM config for Better Auth
├── package.json
└── .env.local
```

**Note**: Better Auth manages the `user`, `session`, and `account` tables via its Drizzle adapter. FastAPI only manages the `tasks` table.

**Structure Decision**: Web application with separate `backend/` and `frontend/` directories at repository root. This enables independent deployment (Vercel for frontend, Railway/Render for backend) and clear separation of concerns per Constitution Principle X.

## Architecture Overview

```
┌─────────────────────────────────────┐
│           Frontend (Next.js)         │
│  ┌─────────────┐  ┌───────────────┐ │
│  │ Better Auth │  │  Task Pages   │ │
│  │  (Auth UI)  │  │  (Protected)  │ │
│  └──────┬──────┘  └───────┬───────┘ │
│         │                 │         │
└─────────┼─────────────────┼─────────┘
          │                 │
    Auth API            Task API
    (Next.js             (FastAPI)
     API Routes)      JWT + REST
          │                 │
          ▼                 ▼
┌─────────────────────────────────────┐
│         Neon PostgreSQL              │
│  ┌─────────────┐  ┌───────────────┐ │
│  │   users     │  │    tasks      │ │
│  │  sessions   │  │  (user_id FK) │ │
│  │  accounts   │  │               │ │
│  └─────────────┘  └───────────────┘ │
└─────────────────────────────────────┘
```

**Key Architecture Points**:
- Better Auth runs on Next.js (frontend) and owns user authentication
- Better Auth stores users, sessions, and accounts in Neon PostgreSQL
- FastAPI backend only verifies JWTs and manages tasks
- Both services share the same Neon database (different tables)

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    REGISTRATION / LOGIN                           │
└──────────────────────────────────────────────────────────────────┘

┌──────────┐    POST /api/auth/signup   ┌──────────────┐   INSERT   ┌────────┐
│  Client  │ ──────────────────────────►│  Better Auth │ ──────────►│   DB   │
│ (Browser)│◄────────────────────────── │  (Next.js)   │◄───────────│ users  │
└──────────┘   Set-Cookie: session      └──────────────┘            └────────┘

┌──────────┐    POST /api/auth/signin   ┌──────────────┐   SELECT   ┌────────┐
│  Client  │ ──────────────────────────►│  Better Auth │ ──────────►│   DB   │
│ (Browser)│◄────────────────────────── │  (Next.js)   │◄───────────│ users  │
└──────────┘   Set-Cookie: session      └──────────────┘  verify    └────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    TASK API (Protected)                           │
└──────────────────────────────────────────────────────────────────┘

┌──────────┐   GET session + JWT        ┌──────────────┐
│  Client  │ ──────────────────────────►│  Better Auth │
│ (Browser)│◄────────────────────────── │  (Next.js)   │
└──────────┘   { jwt: "eyJ..." }        └──────────────┘

┌──────────┐    GET /api/v1/tasks       ┌──────────────┐   SELECT   ┌────────┐
│  Client  │    Authorization: Bearer   │   FastAPI    │ ──────────►│   DB   │
│ (Browser)│ ──────────────────────────►│  (Backend)   │◄───────────│ tasks  │
│          │◄────────────────────────── │  verify JWT  │  WHERE     │        │
└──────────┘   [ tasks ]                └──────────────┘  user_id   └────────┘
```

## Key Design Decisions

### 1. Authentication Strategy: Better Auth (Frontend) + JWT Verification (Backend)

**Decision**: Use Better Auth on the Next.js frontend for user management and session handling. FastAPI backend only verifies JWTs issued by Better Auth.

**Architecture**:
- **Better Auth (Next.js)**: Handles registration, login, logout, session management, password hashing
- **FastAPI**: Verifies JWT tokens using Better Auth's public key/secret, extracts user_id for task queries

**Rationale**:
- Better Auth is a full-featured TypeScript auth library designed for Next.js
- Provides built-in UI components, session management, and database adapters
- Constitution requires Better Auth for authentication (Principle XI)
- Separation of concerns: auth on frontend, business logic on backend
- Better Auth handles complexity (password hashing, session rotation, CSRF)

**Trade-offs**:
- (+) Battle-tested auth implementation with security best practices
- (+) Built-in support for Neon PostgreSQL via Drizzle/Prisma adapters
- (+) Session-based auth with JWT for API calls (best of both worlds)
- (+) Reduces backend complexity significantly
- (-) Shared database between frontend (users) and backend (tasks)
- (-) Must configure JWT secret sharing between services

### 2. Database Access: SQLModel Direct

**Decision**: Use SQLModel models directly in API endpoints without repository pattern.

**Rationale**:
- Constitution Principle IV: Simplicity over cleverness
- SQLModel provides both Pydantic validation and SQLAlchemy ORM
- Small app doesn't benefit from extra abstraction layer

**Trade-offs**:
- (+) Less code, faster development
- (+) SQLModel handles validation automatically
- (-) Tighter coupling (acceptable for MVP scope)

### 3. Frontend State: Server Components + Client Forms

**Decision**: Use React Server Components for data fetching, Client Components only for interactive forms.

**Rationale**:
- Constitution Principle V: Use Server Components where appropriate
- Reduces client-side JavaScript bundle
- Better initial page load performance

**Trade-offs**:
- (+) Better SEO and performance
- (+) Simpler data fetching patterns
- (-) Must be careful about client/server boundaries

### 4. API Versioning: URL Prefix

**Decision**: Use `/api/v1/` prefix for all API endpoints.

**Rationale**:
- Constitution requires API versioning SHOULD use URL prefix
- Enables future API evolution without breaking clients
- Clear separation from any frontend routes

## Error Handling Strategy

### Backend Errors

| Status | When | Response Body |
|--------|------|---------------|
| 200 | Success | `{ data: ... }` |
| 201 | Created | `{ data: ... }` |
| 400 | Validation error | `{ detail: "..." }` |
| 401 | Missing/invalid JWT | `{ detail: "Not authenticated" }` |
| 404 | Resource not found OR wrong user | `{ detail: "Task not found" }` |
| 500 | Server error | `{ detail: "Internal server error" }` |

**Note**: 404 is returned for both "not found" and "belongs to other user" to prevent enumeration (FR-015).

### Frontend Errors

- Display toast/alert for API errors
- Show inline validation errors before submission
- Redirect to login on 401 responses
- Generic error message for 500 errors

## Security Considerations

| Threat | Mitigation |
|--------|------------|
| Password theft | Better Auth uses bcrypt/argon2 hashing |
| Session theft | Better Auth httpOnly cookies, secure flag |
| Token theft | Short-lived JWTs (15 min), session-based refresh |
| CSRF | Better Auth built-in CSRF protection |
| SQL injection | SQLModel parameterized queries, Drizzle ORM |
| XSS | React auto-escaping, no dangerouslySetInnerHTML |
| User enumeration | Better Auth generic error messages |
| Unauthorized access | JWT verification + user_id filtering |

**Better Auth Security Features**:
- Automatic session rotation
- Rate limiting on auth endpoints
- Secure cookie configuration (httpOnly, SameSite, Secure)
- Built-in CSRF token validation

## Performance Targets

| Metric | Target | How Achieved |
|--------|--------|--------------|
| Page load | <2s | Server Components, CDN |
| API response | <500ms | Async endpoints, connection pooling |
| Task list render | <100ms | Client-side state, optimistic updates |
| Concurrent users | 100 | Stateless backend, Neon pooling |

## Deployment Strategy

### Environment Variables

**Backend (.env)**:
```
DATABASE_URL=postgresql+asyncpg://user:pass@host/db
BETTER_AUTH_SECRET=<same-secret-as-frontend>
CORS_ORIGINS=https://frontend-domain.vercel.app
```

**Frontend (.env.local)**:
```
# Better Auth Configuration
BETTER_AUTH_SECRET=<random-256-bit-key>
BETTER_AUTH_URL=https://frontend-domain.vercel.app

# Database (for Better Auth - same DB as backend)
DATABASE_URL=postgresql://user:pass@host/db

# Backend API
NEXT_PUBLIC_API_URL=https://backend-domain.railway.app/api/v1
```

**Shared Secret**: Both frontend and backend must use the same `BETTER_AUTH_SECRET` for JWT verification.

### Deployment Targets

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | Vercel | Auto-deploy from main branch |
| Backend | Railway | Dockerfile deployment |
| Database | Neon | Serverless PostgreSQL |

## Complexity Tracking

> No constitution violations requiring justification. All decisions align with principles.

| Decision | Principle Alignment |
|----------|---------------------|
| Separate frontend/backend | X. Service Separation ✅ |
| Better Auth on frontend | XI. JWT Authentication ✅ (Constitution requires Better Auth) |
| JWT verification on backend | XI. JWT Authentication ✅ |
| User filtering by JWT user_id | XII. Data Isolation ✅ |
| No repository pattern | IV. Simplicity ✅ |
| No GraphQL | VIII. Phase II Scope (REST only) ✅ |
| Shared database (Neon) | IV. Simplicity ✅ (avoids sync complexity) |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Neon cold start latency | Medium | Low | Connection pooling, keep-alive queries |
| Better Auth + FastAPI secret mismatch | Medium | High | Document shared secret setup, verify in staging |
| Shared database schema conflicts | Low | Medium | Clear table ownership (Better Auth: users; FastAPI: tasks) |
| CORS misconfiguration | Medium | High | Explicit origin list, test in staging |
| Better Auth version updates | Low | Medium | Pin versions, test upgrades in dev first |

## Next Steps

1. Run `/sp.tasks` to generate implementation task list
2. Execute tasks via `/sp.implement`
3. Deploy backend to Railway
4. Deploy frontend to Vercel
5. Configure production environment variables
6. Run end-to-end testing
