# Data Model: Full-Stack Todo Web Application

**Feature**: 002-phase-ii
**Date**: 2026-02-05
**Database**: Neon PostgreSQL

## Overview

The database is shared between two services:
- **Better Auth (Frontend)**: Manages `user`, `session`, `account`, `verification` tables
- **FastAPI (Backend)**: Manages `tasks` table only

## Entity Relationship Diagram

```
┌─────────────────────────────────────┐
│    user (Better Auth managed)        │
├─────────────────────────────────────┤
│ id          VARCHAR   PK            │
│ email       VARCHAR   UNIQUE        │
│ name        VARCHAR   NULLABLE      │
│ emailVerified BOOLEAN              │
│ image       VARCHAR   NULLABLE      │
│ createdAt   TIMESTAMP               │
│ updatedAt   TIMESTAMP               │
└─────────────────────────────────────┘
                │
                │ 1:N (user.id → tasks.user_id)
                ▼
┌─────────────────────────────────────┐
│     tasks (FastAPI managed)          │
├─────────────────────────────────────┤
│ id          UUID      PK            │
│ title       VARCHAR   NOT NULL      │
│ description TEXT      NULLABLE      │
│ completed   BOOLEAN   NOT NULL      │
│ user_id     VARCHAR   NOT NULL      │
│ created_at  TIMESTAMP NOT NULL      │
│ updated_at  TIMESTAMP NOT NULL      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   session (Better Auth managed)      │
├─────────────────────────────────────┤
│ id          VARCHAR   PK            │
│ userId      VARCHAR   FK → user.id  │
│ expiresAt   TIMESTAMP               │
│ token       VARCHAR   UNIQUE        │
│ createdAt   TIMESTAMP               │
│ updatedAt   TIMESTAMP               │
└─────────────────────────────────────┘
```

## Table Definitions

### user (Better Auth Managed)

**Note**: This table is created and managed by Better Auth via Drizzle ORM. Do not modify directly.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID string identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| name | VARCHAR(255) | NULLABLE | User's display name |
| emailVerified | BOOLEAN | DEFAULT FALSE | Email verification status |
| image | VARCHAR(255) | NULLABLE | Profile image URL |
| createdAt | TIMESTAMP | NOT NULL | Account creation time |
| updatedAt | TIMESTAMP | NOT NULL | Last update time |

### session (Better Auth Managed)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | Session identifier |
| userId | VARCHAR(36) | FK → user.id | Associated user |
| token | VARCHAR(255) | UNIQUE | Session token |
| expiresAt | TIMESTAMP | NOT NULL | Session expiry |
| createdAt | TIMESTAMP | NOT NULL | Creation time |
| updatedAt | TIMESTAMP | NOT NULL | Update time |

### tasks (FastAPI Managed)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| title | VARCHAR(200) | NOT NULL | Task title (1-200 chars) |
| description | TEXT | NULLABLE | Task description (max 2000 chars) |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| user_id | VARCHAR(36) | NOT NULL | Task owner (from JWT sub claim) |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes**:
- `tasks_pkey` on `id` (primary key)
- `tasks_user_id_idx` on `user_id` (query optimization)

**Note**: `user_id` references `user.id` from Better Auth tables but is NOT a foreign key constraint. This allows the backend to operate independently. The user_id is extracted from validated JWTs, ensuring data integrity without tight coupling.

## SQLModel Definitions

### Task Model (FastAPI Backend)

```python
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional
from sqlmodel import Field, SQLModel

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(max_length=36, index=True)  # VARCHAR from Better Auth
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TaskCreate(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: Optional[bool] = None

class TaskRead(TaskBase):
    id: UUID
    user_id: str
    created_at: datetime
    updated_at: datetime
```

**Note**: No User model in FastAPI - users are managed by Better Auth. The `user_id` is a string (VARCHAR) to match Better Auth's ID format.

## Migration Strategy

### Better Auth Tables (Managed by Drizzle)

Better Auth tables are created automatically when running `npx drizzle-kit push` in the frontend project. These include:
- `user`
- `session`
- `account`
- `verification`

**Do not manually create or modify these tables.**

### FastAPI Migration (001_create_tasks)

```sql
-- Create tasks table (FastAPI managed)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id VARCHAR(36) NOT NULL,  -- References Better Auth user.id
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX tasks_user_id_idx ON tasks(user_id);
```

**Note**: No foreign key constraint to `user` table. This allows:
- Independent backend deployment
- Better Auth schema changes without backend migration
- Data integrity via validated JWTs (only valid user_ids reach the backend)

### Rollback

```sql
DROP TABLE IF EXISTS tasks;
-- Do NOT drop Better Auth tables here
```

## Data Validation Rules

### User Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| email | Valid email format | "Invalid email format" |
| email | Max 255 characters | "Email too long" |
| email | Unique in database | "Email already registered" |
| password | Min 8 characters | "Password must be at least 8 characters" |

### Task Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| title | Required (not empty) | "Title is required" |
| title | 1-200 characters | "Title must be 1-200 characters" |
| description | Max 2000 characters | "Description must be at most 2000 characters" |
| completed | Boolean | "Completed must be true or false" |

## Query Patterns

### User Queries (Better Auth - Frontend Only)

User queries are handled by Better Auth. The FastAPI backend **never** queries the user table directly.

### Task Queries (FastAPI Backend)

```python
# List all tasks for user (CRITICAL: always filter by user_id from JWT)
SELECT * FROM tasks WHERE user_id = :user_id ORDER BY created_at DESC;

# Get single task (CRITICAL: include user_id in WHERE)
SELECT * FROM tasks WHERE id = :task_id AND user_id = :user_id;

# Create task (user_id comes from validated JWT)
INSERT INTO tasks (title, description, user_id)
VALUES (:title, :description, :user_id) RETURNING *;

# Update task (CRITICAL: include user_id in WHERE)
UPDATE tasks
SET title = :title, description = :description, completed = :completed, updated_at = NOW()
WHERE id = :task_id AND user_id = :user_id
RETURNING *;

# Delete task (CRITICAL: include user_id in WHERE)
DELETE FROM tasks WHERE id = :task_id AND user_id = :user_id;
```

**Security Note**: All task queries MUST include `user_id` in the WHERE clause. The `user_id` is extracted from the validated JWT (Constitution Principle XII).

## Data Retention

- User data: Retained until account deletion (out of Phase II scope)
- Task data: Cascade deleted when user is deleted
- No soft deletes in Phase II (simplicity)
- No data export feature in Phase II (out of scope)
