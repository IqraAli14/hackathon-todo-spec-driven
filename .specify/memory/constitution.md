<!--
  Sync Impact Report
  ===================
  Version change: 1.0.0 → 2.0.0 (MAJOR - Phase II full-stack architecture)

  Modified Principles:
  - VIII. Phase I Scope Enforcement → VIII. Phase II Scope Enforcement (complete rewrite)

  Added Principles:
  - X. Service Separation
  - XI. JWT Authentication Required
  - XII. Multi-User Data Isolation

  Removed Sections:
  - CLI Requirements (replaced by Frontend/Backend Requirements)
  - Data Model Constraints (replaced by Database Constraints)

  Added Sections:
  - Frontend Requirements
  - Backend Requirements
  - Database Constraints
  - Authentication Requirements
  - API Design Requirements
  - Deployment Requirements

  Templates Status:
  - .specify/templates/plan-template.md ✅ Compatible (Constitution Check section; web app structure exists)
  - .specify/templates/spec-template.md ✅ Compatible (acceptance criteria aligned; prioritized stories)
  - .specify/templates/tasks-template.md ✅ Compatible (web app structure option available)
  - .specify/templates/phr-template.prompt.md ✅ Compatible (no constitution dependencies)

  Follow-up TODOs: None
-->

# Hackathon II Todo Application Constitution

## Phase II: Full-Stack Web Application

This constitution supersedes Phase I for all Phase II features. Phase I code remains as reference but is not actively maintained.

## Core Principles

### I. Spec-Driven Development Only

All implementation MUST originate from approved specifications. Code generation is ONLY permitted via the `/sp.implement` command after specs pass review.

- Features MUST be defined in `specs/<feature>/spec.md` before any implementation
- Implementation plans MUST exist in `specs/<feature>/plan.md` before task generation
- Tasks MUST be generated via `/sp.tasks` before execution
- Direct code writing without spec approval is PROHIBITED

**Rationale**: Ensures traceability, prevents scope creep, and maintains hackathon compliance.

### II. No Manual Code Writing

Code MUST be generated exclusively through the SpecKitPlus workflow. Manual coding bypasses quality gates and violates hackathon rules.

- All code changes MUST trace back to a task in `tasks.md`
- Code MUST be generated via `/sp.implement` command execution
- Ad-hoc fixes MUST go through spec amendment first
- Copy-paste from external sources MUST be documented in spec

**Rationale**: Hackathon grading requires demonstrable spec-driven process; manual code is non-compliant.

### III. Python Best Practices (Backend)

All generated backend code MUST follow Python community standards and idioms.

- Python 3.13+ features MUST be used where beneficial
- PEP 8 style guidelines MUST be followed
- Type hints MUST be included for all function signatures
- Docstrings MUST follow Google or NumPy style
- Imports MUST be organized: stdlib, third-party, local
- Async/await MUST be used for I/O operations

**Rationale**: Ensures maintainable, readable code that follows industry standards.

### IV. Simplicity Over Cleverness

Choose the straightforward solution over the elegant but complex one.

- YAGNI (You Aren't Gonna Need It) MUST be enforced
- No premature optimization
- No unnecessary abstractions for single-use cases
- Flat is better than nested
- Explicit is better than implicit

**Rationale**: Complexity increases maintenance burden and risk; keep the hackathon deliverable focused.

### V. TypeScript/React Best Practices (Frontend)

All generated frontend code MUST follow TypeScript and React community standards.

- TypeScript strict mode MUST be enabled
- React Server Components MUST be used where appropriate (Next.js App Router)
- Client components MUST be explicitly marked with 'use client'
- Props MUST have explicit TypeScript interfaces
- State management MUST use React hooks or server state

**Rationale**: Type safety and modern React patterns ensure maintainable frontend code.

### VI. Clear Acceptance Criteria

Every feature and task MUST have testable acceptance criteria.

- User stories MUST follow Given-When-Then format
- Success criteria MUST be measurable
- Edge cases MUST be explicitly documented
- Error scenarios MUST be specified
- Acceptance tests MUST be executable

**Rationale**: Enables objective completion verification and prevents ambiguous requirements.

### VII. RESTful API Design

All backend APIs MUST follow REST conventions.

- Resources MUST be nouns (e.g., `/tasks`, `/users`)
- HTTP methods MUST match semantics (GET=read, POST=create, PUT/PATCH=update, DELETE=delete)
- Status codes MUST be appropriate (200, 201, 400, 401, 403, 404, 500)
- Error responses MUST include message and optional details
- API versioning SHOULD use URL prefix (e.g., `/api/v1/`)

**Rationale**: Consistent API design enables frontend-backend decoupling and future extensibility.

### VIII. Phase II Scope Enforcement

Implementation MUST be strictly limited to Phase II boundaries.

**ALLOWED**:
- Next.js (App Router) for frontend
- Python FastAPI for backend
- SQLModel ORM
- Neon Serverless PostgreSQL
- Better Auth (JWT-based authentication)
- Vercel deployment (frontend)
- Separate backend deployment
- Multi-user support with data isolation

**PROHIBITED**:
- AI Chatbots
- OpenAI Agents SDK
- MCP tools
- Kubernetes
- Kafka
- Dapr
- GraphQL (REST only)
- WebSockets (REST polling acceptable)
- Third-party todo integrations

**Rationale**: Phase II scope is defined by hackathon requirements; out-of-scope features risk timeline.

### IX. Hackathon II Compliance

All artifacts and processes MUST comply with Hackathon II grading criteria.

- Spec-driven workflow MUST be demonstrable
- PHR (Prompt History Records) MUST be created for all interactions
- Git commits MUST reference tasks
- Documentation MUST be current
- Process MUST be auditable end-to-end

**Rationale**: Compliance is mandatory for hackathon success and grading.

### X. Service Separation

Frontend and backend MUST be separate, independently deployable services.

- Frontend MUST NOT directly access the database
- Backend MUST be stateless (no session state in memory)
- All communication MUST occur via REST API calls
- Services MUST be independently deployable
- Environment configuration MUST be separate per service

**Rationale**: Clean separation enables independent scaling, deployment, and team parallelization.

### XI. JWT Authentication Required

All API endpoints (except health checks) MUST require JWT authentication.

- Authentication MUST use Better Auth library
- JWTs MUST be validated on every request
- Tokens MUST have reasonable expiration (e.g., 1 hour access, 7 days refresh)
- Refresh token rotation MUST be implemented
- Failed auth MUST return 401 Unauthorized

**Rationale**: Security is mandatory for multi-user applications; JWT enables stateless auth.

### XII. Multi-User Data Isolation

Each user MUST only access their own data.

- All task queries MUST filter by authenticated user_id
- Task creation MUST associate with authenticated user
- Attempting to access another user's data MUST return 404 (not 403)
- Database queries MUST enforce user scoping at the ORM level
- No admin/superuser access in Phase II scope

**Rationale**: Data privacy is fundamental; returning 404 prevents user enumeration attacks.

## Technical Constraints

### Stack Requirements

| Component | Requirement |
|-----------|-------------|
| Frontend Framework | Next.js (App Router) |
| Frontend Language | TypeScript (strict) |
| Backend Framework | Python FastAPI |
| Backend Language | Python 3.13+ |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth (JWT) |
| Frontend Deployment | Vercel |
| Backend Deployment | TBD (not Vercel) |

### Frontend Requirements

- Next.js 14+ with App Router
- TypeScript strict mode enabled
- Server Components by default, Client Components where needed
- Tailwind CSS for styling (optional but recommended)
- Form validation with clear error messages
- Loading states for all async operations
- Responsive design (mobile-first)

### Backend Requirements

- FastAPI with async endpoints
- SQLModel for ORM and schema validation
- Pydantic for request/response models
- CORS configured for frontend origin
- Health check endpoint at `/health`
- OpenAPI documentation auto-generated at `/docs`

### Database Constraints

- PostgreSQL via Neon Serverless
- Migrations managed via SQLModel or Alembic
- Task schema: id (UUID), title (str), description (str, optional), completed (bool), user_id (UUID), created_at, updated_at
- User schema: id (UUID), email (str, unique), password_hash (str), created_at
- Foreign key constraint: tasks.user_id → users.id

### Authentication Requirements

- Better Auth library for JWT management
- Email/password authentication (no OAuth in Phase II)
- Secure password hashing (bcrypt or argon2)
- Access token + refresh token pattern
- Token stored in httpOnly cookies (preferred) or localStorage
- Protected routes require valid JWT

### API Design Requirements

Base URL: `/api/v1`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | No | Health check |
| `/auth/register` | POST | No | User registration |
| `/auth/login` | POST | No | User login |
| `/auth/refresh` | POST | Yes | Refresh access token |
| `/auth/logout` | POST | Yes | Invalidate tokens |
| `/tasks` | GET | Yes | List user's tasks |
| `/tasks` | POST | Yes | Create task |
| `/tasks/{id}` | GET | Yes | Get single task |
| `/tasks/{id}` | PUT | Yes | Update task |
| `/tasks/{id}` | DELETE | Yes | Delete task |

### Deployment Requirements

- Frontend on Vercel with environment variables
- Backend on separate platform (Railway, Render, Fly.io, or similar)
- Database connection via connection string in environment
- CORS configured for production domains
- HTTPS required in production

## Development Workflow

### Required Sequence

1. **Constitution** → `/sp.constitution` (this document)
2. **Specification** → `/sp.specify` (feature requirements)
3. **Clarification** → `/sp.clarify` (if ambiguities exist)
4. **Planning** → `/sp.plan` (architecture decisions)
5. **Task Generation** → `/sp.tasks` (implementation tasks)
6. **Implementation** → `/sp.implement` (code generation)
7. **Commit** → `/sp.git.commit_pr` (version control)

### Quality Gates

- [ ] Constitution ratified before spec creation
- [ ] Spec approved before planning
- [ ] Plan approved before task generation
- [ ] Tasks approved before implementation
- [ ] All acceptance criteria met before commit
- [ ] PHR created for each significant interaction
- [ ] API contracts validated before frontend integration
- [ ] Authentication tested before feature development

### Prohibited Actions

- Writing code before `/sp.implement`
- Skipping workflow steps
- Implementing features not in spec
- Adding scope during implementation
- Committing without task reference
- Bypassing authentication
- Direct database access from frontend

## Governance

### Amendment Process

1. Propose change with rationale
2. Assess impact on existing artifacts
3. Update constitution version per semantic versioning
4. Propagate changes to dependent templates
5. Document in PHR

### Version Policy

- **MAJOR**: Breaking changes to principles, architecture, or stack
- **MINOR**: New principles or expanded guidance
- **PATCH**: Clarifications and typo fixes

### Compliance Review

- All PRs MUST verify constitution compliance
- Violations MUST be corrected before merge
- Exceptions require documented justification
- Constitution supersedes all other guidance

**Version**: 2.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-05
