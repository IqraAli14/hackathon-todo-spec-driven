---
id: 004
title: Revise Plan Better Auth on Frontend
stage: plan
date: 2026-02-05
surface: agent
model: claude-opus-4-5-20251101
feature: 002-phase-ii
branch: 002-phase-ii
user: developer
command: user request
labels: ["plan", "revision", "better-auth", "architecture"]
links:
  spec: specs/002-phase-ii/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-phase-ii/plan.md
  - specs/002-phase-ii/research.md
  - specs/002-phase-ii/data-model.md
  - specs/002-phase-ii/contracts/auth.md
  - specs/002-phase-ii/quickstart.md
tests:
  - null
---

## Prompt

Plan mentions "Custom JWT (not Better Auth SDK)".
Please revise the plan to use Better Auth on frontend
and JWT verification on FastAPI backend as per constitution.

## Response snapshot

Revised implementation plan to use Better Auth on the Next.js frontend with JWT verification on the FastAPI backend.

**Key Architecture Changes:**

1. **Authentication Ownership**:
   - Before: Custom JWT implementation on FastAPI (passlib + python-jose)
   - After: Better Auth handles all auth on Next.js frontend

2. **Responsibility Split**:
   - Frontend (Better Auth): User registration, login, logout, session management, password hashing, JWT issuance
   - Backend (FastAPI): JWT verification only, task CRUD operations

3. **Database Tables**:
   - Better Auth (via Drizzle): `user`, `session`, `account`, `verification`
   - FastAPI (via Alembic): `tasks` only

4. **Shared Secret**:
   - Both services use identical `BETTER_AUTH_SECRET` for JWT signing/verification

**Files Updated:**
- `plan.md`: Architecture diagrams, key decisions, project structure, deployment strategy
- `research.md`: Authentication section, dependencies, security research
- `data-model.md`: ERD, table definitions, SQLModel (no User model in backend)
- `contracts/auth.md`: Complete rewrite for Better Auth endpoints
- `quickstart.md`: Setup order (frontend first), environment variables

**Benefits:**
- Constitution compliance (Better Auth requirement)
- Battle-tested auth implementation
- Reduced backend complexity
- Better Auth handles security best practices (CSRF, rate limiting, secure cookies)

## Outcome

- ✅ Impact: Plan revised to use Better Auth per constitution requirement
- 🧪 Tests: No tests - planning document updates only
- 📁 Files: 5 files updated in specs/002-phase-ii/
- 🔁 Next prompts: /sp.tasks to generate implementation tasks
- 🧠 Reflection: Architecture change simplifies backend, aligns with constitution

## Evaluation notes (flywheel)

- Failure modes observed: Initial plan misinterpreted constitution - used custom JWT instead of Better Auth
- Graders run and results (PASS/FAIL): Constitution check PASS after revision
- Prompt variant (if applicable): User-requested plan revision
- Next experiment (smallest change to try): N/A - plan revised as requested
