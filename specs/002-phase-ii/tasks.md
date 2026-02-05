# Tasks: Full-Stack Todo Web Application

**Input**: Design documents from `/specs/002-phase-ii/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not explicitly requested in specification - test tasks NOT included.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US7)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/` (Python FastAPI)
- **Frontend**: `frontend/src/` (Next.js App Router)
- **Shared database**: Neon PostgreSQL

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure creation

- [x] T001 Create backend project structure per plan.md in `backend/`
- [x] T002 Create frontend project structure per plan.md in `frontend/`
- [x] T003 [P] Initialize Python backend with FastAPI dependencies in `backend/pyproject.toml` and `backend/requirements.txt`
- [x] T004 [P] Initialize Next.js frontend with TypeScript and dependencies in `frontend/package.json`
- [x] T005 [P] Create backend environment template in `backend/.env.example`
- [x] T006 [P] Create frontend environment template in `frontend/.env.example`
- [x] T007 [P] Configure backend linting (ruff) in `backend/pyproject.toml`
- [x] T008 [P] Configure frontend linting (ESLint) and formatting (Prettier) in `frontend/`
- [x] T009 [P] Configure Tailwind CSS in `frontend/tailwind.config.js` and `frontend/postcss.config.js`
- [x] T010 [P] Create TypeScript configuration in `frontend/tsconfig.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Core Infrastructure

- [x] T011 Create Pydantic settings configuration in `backend/app/config.py`
- [x] T012 Setup async database connection with SQLModel in `backend/app/database.py`
- [x] T013 Initialize Alembic migrations framework in `backend/alembic.ini` and `backend/alembic/`
- [x] T014 Create FastAPI application entry point with CORS in `backend/app/main.py`
- [x] T015 Implement JWT verification dependency (Better Auth) in `backend/app/api/deps.py`
- [x] T016 Create Task SQLModel entity per data-model.md in `backend/app/models/task.py`
- [x] T017 Create `backend/app/models/__init__.py` with model exports
- [x] T018 Create Alembic migration for tasks table in `backend/alembic/versions/001_create_tasks_table.py`
- [x] T019 Create Task Pydantic schemas (TaskCreate, TaskUpdate, TaskRead) in `backend/app/schemas/task.py`
- [x] T020 Create `backend/app/schemas/__init__.py` with schema exports

### Frontend Core Infrastructure

- [x] T021 Configure Better Auth server in `frontend/auth.ts`
- [x] T022 Configure Drizzle ORM for Better Auth in `frontend/drizzle.config.ts`
- [x] T023 Create Better Auth database schema in `frontend/src/lib/db/schema.ts`
- [x] T024 Create Better Auth client configuration in `frontend/src/lib/auth.ts`
- [x] T025 Create Better Auth React hooks in `frontend/src/lib/auth-client.ts`
- [x] T026 Setup Better Auth API routes in `frontend/src/app/api/auth/[...all]/route.ts`
- [x] T027 Create root layout with providers in `frontend/src/app/layout.tsx`
- [x] T028 Create base TypeScript interfaces in `frontend/src/types/index.ts`
- [x] T029 Create API client with JWT support in `frontend/src/lib/api.ts`
- [x] T030 Create form validation utilities in `frontend/src/lib/validations.ts`

### Shared UI Components

- [x] T031 [P] Create Button component in `frontend/src/components/ui/Button.tsx`
- [x] T032 [P] Create Input component in `frontend/src/components/ui/Input.tsx`
- [x] T033 [P] Create Card component in `frontend/src/components/ui/Card.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Registration (Priority: P1) 🎯 MVP

**Goal**: Allow visitors to create accounts with email/password and auto-sign-in

**Independent Test**: Visit `/sign-up`, enter email/password, verify account created and signed in

**Acceptance Criteria**:
- Valid email + password (min 8 chars) → account created, auto sign-in
- Existing email → error message
- Password < 8 chars → validation error
- Invalid email format → validation error

### Implementation for User Story 1

- [x] T034 [P] [US1] Create SignUpForm component in `frontend/src/components/auth/SignUpForm.tsx`
- [x] T035 [US1] Create sign-up page in `frontend/src/app/(auth)/sign-up/page.tsx`
- [x] T036 [US1] Add email validation (format check) to SignUpForm
- [x] T037 [US1] Add password validation (min 8 chars) to SignUpForm
- [x] T038 [US1] Handle registration errors (email exists) in SignUpForm
- [x] T039 [US1] Auto-redirect to tasks page on successful registration

**Checkpoint**: User Story 1 complete - visitors can register and are auto-signed-in

---

## Phase 4: User Story 2 - User Sign In/Sign Out (Priority: P1)

**Goal**: Allow registered users to sign in/out and protect task pages

**Independent Test**: Sign in with valid credentials → see task list; sign out → redirected to sign-in

**Acceptance Criteria**:
- Correct credentials → authenticated, redirected to tasks
- Invalid email/password → generic error (no enumeration)
- Sign out → session ends, redirect to sign-in
- Unauthenticated access to /tasks → redirect to sign-in

### Implementation for User Story 2

- [x] T040 [P] [US2] Create SignInForm component in `frontend/src/components/auth/SignInForm.tsx`
- [x] T041 [US2] Create sign-in page in `frontend/src/app/(auth)/sign-in/page.tsx`
- [x] T042 [US2] Handle sign-in errors with generic message in SignInForm
- [x] T043 [US2] Create protected layout with auth check in `frontend/src/app/(protected)/layout.tsx`
- [x] T044 [US2] Add sign-out functionality to protected layout
- [x] T045 [US2] Create landing page with auth redirect logic in `frontend/src/app/page.tsx`
- [x] T046 [US2] Redirect unauthenticated users to sign-in page

**Checkpoint**: User Stories 1 & 2 complete - full auth flow working

---

## Phase 5: User Story 3 - Create a Task (Priority: P2)

**Goal**: Allow authenticated users to add tasks with title and optional description

**Independent Test**: Sign in, create task with title/description, verify appears in list

**Acceptance Criteria**:
- Title provided → task created with status incomplete
- Title + description → both saved
- Empty title → validation error
- New task appears in list immediately

### Backend Implementation for User Story 3

- [x] T047 [US3] Create TaskService with create method in `backend/app/services/task.py`
- [x] T048 [US3] Create `backend/app/services/__init__.py` with service exports
- [x] T049 [US3] Implement POST /tasks endpoint in `backend/app/api/tasks.py`
- [x] T050 [US3] Create `backend/app/api/__init__.py` with router setup
- [x] T051 [US3] Register tasks router in `backend/app/main.py`

### Frontend Implementation for User Story 3

- [x] T052 [P] [US3] Create TaskForm component in `frontend/src/components/TaskForm.tsx`
- [x] T053 [US3] Add create task API call to `frontend/src/lib/api.ts`
- [x] T054 [US3] Add title validation (1-200 chars) to TaskForm
- [x] T055 [US3] Add description validation (max 2000 chars) to TaskForm
- [x] T056 [US3] Handle create task success with list refresh

**Checkpoint**: User Story 3 complete - users can create tasks

---

## Phase 6: User Story 4 - View Task List (Priority: P2)

**Goal**: Display all tasks for the authenticated user with title, status, creation date

**Independent Test**: Sign in with user that has tasks, verify only their tasks shown with details

**Acceptance Criteria**:
- User with tasks → all their tasks displayed
- Other user's tasks → never visible (data isolation)
- No tasks → empty state message
- Status visually distinguished (complete/incomplete)

### Backend Implementation for User Story 4

- [x] T057 [US4] Add list method (with user_id filter) to TaskService in `backend/app/services/task.py`
- [x] T058 [US4] Implement GET /tasks endpoint with pagination in `backend/app/api/tasks.py`
- [x] T059 [US4] Add completed filter query parameter support

### Frontend Implementation for User Story 4

- [x] T060 [P] [US4] Create TaskItem component in `frontend/src/components/TaskItem.tsx`
- [x] T061 [P] [US4] Create TaskList component in `frontend/src/components/TaskList.tsx`
- [x] T062 [US4] Create tasks page in `frontend/src/app/(protected)/tasks/page.tsx`
- [x] T063 [US4] Add list tasks API call to `frontend/src/lib/api.ts`
- [x] T064 [US4] Display empty state when no tasks exist
- [x] T065 [US4] Visual distinction for completed vs incomplete tasks

**Checkpoint**: User Stories 3 & 4 complete - create and view tasks working

---

## Phase 7: User Story 5 - Update a Task (Priority: P3)

**Goal**: Allow users to edit task title and description

**Independent Test**: Sign in, edit existing task title/description, verify changes persist

**Acceptance Criteria**:
- Edit title → updated title persisted
- Edit description → updated description persisted
- Empty title → validation error
- Update other user's task (URL manipulation) → error, task unchanged

### Backend Implementation for User Story 5

- [x] T066 [US5] Add get_by_id method (with user_id) to TaskService in `backend/app/services/task.py`
- [x] T067 [US5] Add update method (with user_id) to TaskService in `backend/app/services/task.py`
- [x] T068 [US5] Implement GET /tasks/{id} endpoint in `backend/app/api/tasks.py`
- [x] T069 [US5] Implement PUT /tasks/{id} endpoint in `backend/app/api/tasks.py`
- [x] T070 [US5] Implement PATCH /tasks/{id} endpoint in `backend/app/api/tasks.py`
- [x] T071 [US5] Return 404 for both not-found and wrong-user (prevent enumeration)

### Frontend Implementation for User Story 5

- [x] T072 [US5] Add edit mode to TaskItem component
- [x] T073 [US5] Add update task API calls to `frontend/src/lib/api.ts`
- [x] T074 [US5] Handle update validation errors in TaskItem
- [x] T075 [US5] Optimistic UI update on successful edit

**Checkpoint**: User Story 5 complete - users can edit tasks

---

## Phase 8: User Story 6 - Mark Task Complete/Incomplete (Priority: P3)

**Goal**: Allow users to toggle task completion status with visual feedback

**Independent Test**: Sign in, toggle task status, verify visual change and persistence

**Acceptance Criteria**:
- Mark incomplete → complete: status changes
- Mark complete → incomplete: status changes
- Status persists after page refresh
- Completed tasks visually distinguished (strikethrough/color)

### Frontend Implementation for User Story 6

- [x] T076 [US6] Add toggle complete functionality to TaskItem component
- [x] T077 [US6] Add patch task status API call to `frontend/src/lib/api.ts`
- [x] T078 [US6] Apply visual styling (strikethrough) for completed tasks
- [x] T079 [US6] Optimistic UI update on status toggle

**Checkpoint**: User Story 6 complete - users can toggle task status

---

## Phase 9: User Story 7 - Delete a Task (Priority: P4)

**Goal**: Allow users to permanently remove tasks with confirmation

**Independent Test**: Sign in, delete task with confirmation, verify removed from list

**Acceptance Criteria**:
- Delete task → permanently removed
- Confirmation requested before deletion
- Delete other user's task (URL manipulation) → error
- Deleted task does not reappear on refresh

### Backend Implementation for User Story 7

- [x] T080 [US7] Add delete method (with user_id) to TaskService in `backend/app/services/task.py`
- [x] T081 [US7] Implement DELETE /tasks/{id} endpoint in `backend/app/api/tasks.py`

### Frontend Implementation for User Story 7

- [x] T082 [US7] Add delete button to TaskItem component
- [x] T083 [US7] Add confirmation dialog before delete
- [x] T084 [US7] Add delete task API call to `frontend/src/lib/api.ts`
- [x] T085 [US7] Remove task from list on successful delete

**Checkpoint**: User Story 7 complete - users can delete tasks

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements across all user stories

- [x] T086 [P] Add loading states for all async operations in frontend components
- [x] T087 [P] Add error toast/alert component for API errors in `frontend/src/components/ui/Toast.tsx`
- [x] T088 [P] Add health check endpoint in `backend/app/main.py`
- [x] T089 Implement session expiry handling (redirect to sign-in on 401)
- [x] T090 Add client-side validation messages for all forms
- [x] T091 Run quickstart.md validation - verify both services start and connect
- [x] T092 Verify CORS configuration works in development
- [x] T093 [P] Create Dockerfile for backend in `backend/Dockerfile`
- [x] T094 [P] Configure Next.js for production build in `frontend/next.config.js`

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → No dependencies
Phase 2 (Foundational) → Depends on Phase 1
Phase 3-9 (User Stories) → ALL depend on Phase 2 completion
Phase 10 (Polish) → Depends on all user story phases
```

### User Story Dependencies

| Story | Priority | Can Start After | Dependencies |
|-------|----------|-----------------|--------------|
| US1 - Registration | P1 | Phase 2 | None |
| US2 - Sign In/Out | P1 | Phase 2 | None (independent of US1) |
| US3 - Create Task | P2 | Phase 2 | None (auth from US1/US2 assumed) |
| US4 - View Tasks | P2 | Phase 2 | None (shares TaskService with US3) |
| US5 - Update Task | P3 | Phase 2 | TaskService from US3/US4 |
| US6 - Toggle Status | P3 | Phase 2 | PATCH endpoint from US5 |
| US7 - Delete Task | P4 | Phase 2 | TaskService pattern from US3-US5 |

### Within Each Phase

- Backend tasks can run parallel to frontend tasks (different directories)
- Tasks marked [P] within a phase can run simultaneously
- Tasks without [P] have internal dependencies - run sequentially

---

## Parallel Execution Examples

### Phase 1: Setup (All [P] tasks in parallel)

```bash
# Launch simultaneously:
T003: Initialize Python backend
T004: Initialize Next.js frontend
T005: Backend .env.example
T006: Frontend .env.example
T007: Backend linting (ruff)
T008: Frontend linting (ESLint)
T009: Tailwind CSS config
T010: TypeScript config
```

### Phase 2: Foundational (Backend parallel to Frontend)

```bash
# Backend tasks (T011-T020) can run parallel to Frontend tasks (T021-T033)
# Within each group, follow sequential order except [P] tasks
```

### User Story Phases (After Phase 2)

```bash
# With multiple developers:
Developer A: US1 (T034-T039) + US2 (T040-T046)
Developer B: US3 Backend (T047-T051) + US4 Backend (T057-T059)
Developer C: US3 Frontend (T052-T056) + US4 Frontend (T060-T065)
```

---

## Implementation Strategy

### MVP First (Stories 1-4)

1. Complete Phase 1: Setup → Project structure ready
2. Complete Phase 2: Foundational → Auth + DB + API infrastructure ready
3. Complete Phase 3: US1 Registration → Users can create accounts
4. Complete Phase 4: US2 Sign In/Out → Full auth flow working
5. Complete Phase 5: US3 Create Task → Core value: add tasks
6. Complete Phase 6: US4 View Tasks → Core value: see tasks
7. **STOP and VALIDATE**: Functional MVP with auth and basic CRUD
8. Demo/Deploy if needed

### Full Feature Set

Continue with:
- Phase 7: US5 Update Task
- Phase 8: US6 Toggle Status
- Phase 9: US7 Delete Task
- Phase 10: Polish

### Incremental Delivery Value

| After Phase | User Can... |
|-------------|-------------|
| Phase 4 | Register, sign in, sign out |
| Phase 5 | Create tasks |
| Phase 6 | View all their tasks |
| Phase 7 | Edit tasks |
| Phase 8 | Mark tasks complete/incomplete |
| Phase 9 | Delete tasks |
| Phase 10 | Use polished, production-ready app |

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 94 |
| Phase 1 (Setup) | 10 |
| Phase 2 (Foundational) | 23 |
| Phase 3 (US1 Registration) | 6 |
| Phase 4 (US2 Sign In/Out) | 7 |
| Phase 5 (US3 Create Task) | 10 |
| Phase 6 (US4 View Tasks) | 9 |
| Phase 7 (US5 Update Task) | 10 |
| Phase 8 (US6 Toggle Status) | 4 |
| Phase 9 (US7 Delete Task) | 6 |
| Phase 10 (Polish) | 9 |
| Parallelizable Tasks [P] | 26 |

---

## Notes

- [P] tasks = different files, no dependencies
- [USx] label maps task to user story for traceability
- Backend and frontend tasks can run in parallel (different directories)
- Each user story delivers testable increment
- Stop at any checkpoint to validate independently
- Commit after each task or logical group
