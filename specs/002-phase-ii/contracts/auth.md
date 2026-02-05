# API Contract: Authentication (Better Auth)

**Feature**: 002-phase-ii
**Date**: 2026-02-05
**Authentication Provider**: Better Auth (Next.js)

## Architecture Overview

Authentication is handled entirely by **Better Auth** on the Next.js frontend. The FastAPI backend only **verifies JWTs** - it does not manage users or sessions.

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      Better Auth                         │    │
│  │  - User registration/login                               │    │
│  │  - Session management                                    │    │
│  │  - Password hashing                                      │    │
│  │  - JWT issuance                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                    JWT in Authorization header
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (FastAPI)                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    JWT Verification                      │    │
│  │  - Verify signature using BETTER_AUTH_SECRET             │    │
│  │  - Extract user_id from JWT claims                       │    │
│  │  - Inject user_id into request context                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Better Auth Endpoints (Frontend)

These endpoints are served by Next.js API routes via Better Auth. They are **not** part of the FastAPI backend.

**Base URL**: `/api/auth` (Next.js)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/sign-up` | POST | Create new user account |
| `/api/auth/sign-in/email` | POST | Sign in with email/password |
| `/api/auth/sign-out` | POST | End session |
| `/api/auth/session` | GET | Get current session |
| `/api/auth/get-session` | GET | Get session with JWT for API calls |

---

## POST /api/auth/sign-up

Create a new user account via Better Auth.

### Request

```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

### Response: 200 OK

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "createdAt": "2026-02-05T10:30:00Z",
    "updatedAt": "2026-02-05T10:30:00Z"
  },
  "session": {
    "id": "session-id",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "expiresAt": "2026-02-12T10:30:00Z"
  }
}
```

Session cookie is automatically set by Better Auth.

### Response: 400 Bad Request

```json
{
  "error": "User already exists"
}
```

---

## POST /api/auth/sign-in/email

Sign in with email and password.

### Request

```http
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Response: 200 OK

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "id": "session-id",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "expiresAt": "2026-02-12T10:30:00Z"
  }
}
```

### Response: 401 Unauthorized

```json
{
  "error": "Invalid credentials"
}
```

---

## POST /api/auth/sign-out

End the current session.

### Request

```http
POST /api/auth/sign-out
Cookie: better-auth.session_token=<session-token>
```

### Response: 200 OK

```json
{
  "success": true
}
```

Session cookie is cleared.

---

## GET /api/auth/get-session

Get current session with JWT for backend API calls.

### Request

```http
GET /api/auth/get-session
Cookie: better-auth.session_token=<session-token>
```

### Response: 200 OK

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "id": "session-id",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "expiresAt": "2026-02-12T10:30:00Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

The `session.token` is the JWT to use for FastAPI backend calls.

### Response: 401 Unauthorized

```json
{
  "error": "Not authenticated"
}
```

---

## JWT Token Structure

JWTs issued by Better Auth for backend API calls:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "iat": 1707130600,
  "exp": 1707131500,
  "iss": "better-auth"
}
```

| Claim | Description |
|-------|-------------|
| sub | User ID (UUID) |
| iat | Issued at time (Unix timestamp) |
| exp | Expiration time (Unix timestamp) |
| iss | Issuer identifier |

**Expiry**: 15 minutes (configurable in Better Auth)

---

## Backend JWT Verification

The FastAPI backend verifies JWTs using the shared `BETTER_AUTH_SECRET`.

### FastAPI Dependency

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import settings

security = HTTPBearer()

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Verify JWT and extract user_id."""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
```

### Usage in Endpoints

```python
@router.get("/tasks")
async def list_tasks(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # user_id is guaranteed to be valid
    tasks = await db.exec(
        select(Task).where(Task.user_id == user_id)
    )
    return tasks.all()
```

---

## Frontend Integration

### Better Auth Client Setup

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

### Getting JWT for API Calls

```typescript
// lib/api.ts
import { authClient } from "./auth-client";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const session = await authClient.getSession();

  if (!session?.session?.token) {
    throw new Error("Not authenticated");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${session.session.token}`,
      "Content-Type": "application/json",
    },
  });
}
```

---

## Error Codes

| Status | Source | Description |
|--------|--------|-------------|
| 200 | Better Auth | Success |
| 400 | Better Auth | Invalid request / user exists |
| 401 | Better Auth | Invalid credentials |
| 401 | FastAPI | Invalid/expired JWT |
| 500 | Either | Server error |

---

## Database Tables (Better Auth)

Better Auth creates and manages these tables in Neon PostgreSQL:

| Table | Description |
|-------|-------------|
| `user` | User accounts (id, email, name, emailVerified, etc.) |
| `session` | Active sessions |
| `account` | OAuth accounts (not used in Phase II) |
| `verification` | Email verification tokens (not used in Phase II) |

**Note**: These tables are managed by Better Auth via Drizzle ORM. The FastAPI backend only reads from the `user` table if needed (via user_id from JWT).
