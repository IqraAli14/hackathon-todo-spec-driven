# Technology Research: Full-Stack Todo Web Application

**Feature**: 002-phase-ii
**Date**: 2026-02-05
**Purpose**: Document technology choices and alternatives considered

## Stack Selection

### Frontend: Next.js (App Router)

**Why Next.js 14+ with App Router**:
- Constitution requirement (VIII. Phase II Scope)
- Server Components reduce client bundle size
- Built-in routing, no additional router needed
- Vercel deployment is optimized for Next.js
- TypeScript support is first-class

**Alternatives Considered**:
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Vite + React | Faster dev builds | No SSR, manual routing | ❌ Constitution requires Next.js |
| Remix | Excellent data loading | Different deployment model | ❌ Constitution requires Next.js |
| Next.js Pages Router | More tutorials | Legacy pattern, less performant | ❌ App Router preferred |

### Backend: FastAPI

**Why FastAPI**:
- Constitution requirement (VIII. Phase II Scope)
- Native async support for I/O-bound operations
- Automatic OpenAPI documentation
- Pydantic integration for validation
- Excellent performance characteristics

**Alternatives Considered**:
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Django + DRF | Full-featured, mature | Heavier, sync by default | ❌ Constitution requires FastAPI |
| Flask | Lightweight, flexible | Manual everything | ❌ Constitution requires FastAPI |
| Litestar | Modern, async-first | Less ecosystem | ❌ Constitution requires FastAPI |

### ORM: SQLModel

**Why SQLModel**:
- Constitution requirement (VIII. Phase II Scope)
- Combines SQLAlchemy ORM + Pydantic validation
- Single model definition for DB and API
- Native async support with asyncpg
- Created by FastAPI author (Sebastián Ramírez)

**Alternatives Considered**:
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| SQLAlchemy alone | More control | Separate Pydantic models | ❌ Constitution requires SQLModel |
| Tortoise ORM | Django-like | Less integration | ❌ Constitution requires SQLModel |
| Prisma Python | Type-safe queries | Different paradigm | ❌ Constitution requires SQLModel |

### Database: Neon PostgreSQL

**Why Neon Serverless PostgreSQL**:
- Constitution requirement (VIII. Phase II Scope)
- Serverless = no infrastructure management
- Auto-scaling and connection pooling
- PostgreSQL compatibility (mature, reliable)
- Free tier sufficient for hackathon

**Alternatives Considered**:
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Supabase | More features | Overkill for MVP | ❌ Constitution requires Neon |
| PlanetScale | MySQL-based | Not PostgreSQL | ❌ Constitution requires PostgreSQL |
| Local PostgreSQL | Full control | Manual deployment | ❌ Neon simplifies ops |

### Authentication: Better Auth (Frontend) + JWT Verification (Backend)

**Why Better Auth on Frontend**:
- Constitution requirement (XI. JWT Authentication requires Better Auth)
- Full-featured TypeScript auth library designed for Next.js
- Built-in support for email/password, sessions, and JWT
- Database adapters for PostgreSQL (Drizzle, Prisma)
- Handles security best practices (CSRF, rate limiting, secure cookies)

**Architecture**:
- **Better Auth (Next.js)**: Manages users, sessions, password hashing, JWT issuance
- **FastAPI**: Verifies JWTs using shared secret, extracts user_id for queries

**Libraries Selected**:

*Frontend (Better Auth)*:
- `better-auth`: Core authentication library
- `@better-auth/drizzle-adapter`: PostgreSQL adapter via Drizzle ORM
- `drizzle-orm`: ORM for Better Auth schema (users, sessions, accounts)

*Backend (JWT Verification)*:
- `python-jose[cryptography]`: JWT verification only (not issuance)
- `pydantic-settings`: Environment configuration

**Token Strategy** (managed by Better Auth):
- Session-based auth on frontend (httpOnly cookies)
- JWT issued by Better Auth for backend API calls
- JWT expiry: 15 minutes (short-lived for security)
- Session refresh: Automatic via Better Auth session management

## Dependency Versions

### Backend (Python 3.13+)

```txt
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlmodel>=0.0.14
asyncpg>=0.29.0
alembic>=1.13.0
python-jose[cryptography]>=3.3.0
pydantic-settings>=2.1.0
```

**Note**: No passlib/bcrypt - Better Auth handles password hashing on frontend.

### Frontend (Node.js 20+)

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "better-auth": "^1.0.0",
    "drizzle-orm": "^0.29.0",
    "@neondatabase/serverless": "^0.9.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "drizzle-kit": "^0.20.0"
  }
}
```

## Performance Research

### Neon PostgreSQL Connection Pooling

- Neon provides built-in connection pooling via PgBouncer
- Connection string format: `postgresql://user:pass@host/db?sslmode=require`
- Pooler endpoint for serverless: Use `-pooler` suffix on host
- Recommended: Set `pool_size` based on Neon plan limits

### FastAPI Async Performance

- Use `async def` for all endpoints with I/O
- SQLModel async sessions via `AsyncSession`
- Connection pool: SQLAlchemy `create_async_engine` with pool settings
- Target: 100+ concurrent requests with proper pooling

### Next.js Server Components

- Data fetching in Server Components avoids client waterfall
- `fetch` with `cache: 'no-store'` for real-time data
- Loading states via `loading.tsx` convention
- Error boundaries via `error.tsx` convention

## Security Research

### Password Hashing (Better Auth)

- Better Auth uses bcrypt or argon2 for password hashing
- Work factor configured via Better Auth options
- Automatic salt generation and constant-time comparison
- No direct access to password hashes from backend

### JWT Security

- Algorithm: HS256 (symmetric, shared secret between frontend and backend)
- Secret: `BETTER_AUTH_SECRET` environment variable (min 256-bit)
- Claims issued by Better Auth:
  - `sub`: User ID
  - `exp`: Expiration timestamp
  - `iat`: Issued at timestamp
  - `iss`: Issuer (Better Auth)
- Backend validation: Verify signature, check expiry, extract user_id

### Better Auth Security Features

- CSRF protection built-in
- Rate limiting on auth endpoints
- Session rotation on privilege escalation
- Secure cookie defaults (httpOnly, SameSite=Lax, Secure in production)
- Account lockout after failed attempts (configurable)

### CORS Configuration

```python
# Backend FastAPI
origins = [
    "https://your-frontend.vercel.app",
    "http://localhost:3000",  # Development only
]
```

### Shared Secret Setup

```bash
# Generate secure secret (use same value for both services)
openssl rand -base64 32
```

Both `frontend/.env.local` and `backend/.env` must have identical `BETTER_AUTH_SECRET`.

## References

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Next.js Guide](https://www.better-auth.com/docs/integrations/nextjs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
