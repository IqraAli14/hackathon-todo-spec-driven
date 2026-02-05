# API Contract: Tasks

**Base URL**: `/api/v1`
**Feature**: 002-phase-ii
**Date**: 2026-02-05

## Authentication

All task endpoints require a valid JWT access token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

Requests without valid authentication receive `401 Unauthorized`.

## Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tasks` | GET | List all tasks for current user |
| `/tasks` | POST | Create a new task |
| `/tasks/{id}` | GET | Get a specific task |
| `/tasks/{id}` | PUT | Update a task |
| `/tasks/{id}` | PATCH | Partially update a task |
| `/tasks/{id}` | DELETE | Delete a task |

---

## GET /tasks

List all tasks belonging to the authenticated user.

### Request

```http
GET /api/v1/tasks
Authorization: Bearer <access_token>
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| completed | boolean | - | Filter by completion status |
| limit | integer | 50 | Maximum number of tasks to return |
| offset | integer | 0 | Number of tasks to skip |

### Response: 200 OK

```json
{
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Buy groceries",
      "description": "Milk, bread, eggs",
      "completed": false,
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2026-02-05T10:30:00Z",
      "updated_at": "2026-02-05T10:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "title": "Call mom",
      "description": null,
      "completed": true,
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2026-02-04T15:00:00Z",
      "updated_at": "2026-02-05T09:00:00Z"
    }
  ],
  "total": 2,
  "limit": 50,
  "offset": 0
}
```

### Response: 401 Unauthorized

```json
{
  "detail": "Not authenticated"
}
```

**Security Note**: Only returns tasks where `user_id` matches the authenticated user (FR-014).

---

## POST /tasks

Create a new task for the authenticated user.

### Request

```http
POST /api/v1/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs"
}
```

### Request Schema

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| title | string | Yes | 1-200 characters | Task title |
| description | string | No | Max 2000 characters | Task description |

### Response: 201 Created

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-02-05T10:30:00Z",
  "updated_at": "2026-02-05T10:30:00Z"
}
```

### Response: 422 Unprocessable Entity

```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "ensure this value has at least 1 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

---

## GET /tasks/{id}

Get a specific task by ID.

### Request

```http
GET /api/v1/tasks/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <access_token>
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Task ID |

### Response: 200 OK

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-02-05T10:30:00Z",
  "updated_at": "2026-02-05T10:30:00Z"
}
```

### Response: 404 Not Found

```json
{
  "detail": "Task not found"
}
```

**Security Note**: Returns 404 for both "task doesn't exist" and "task belongs to another user" to prevent enumeration (FR-015).

---

## PUT /tasks/{id}

Replace a task entirely.

### Request

```http
PUT /api/v1/tasks/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Buy groceries and snacks",
  "description": "Milk, bread, eggs, chips",
  "completed": false
}
```

### Request Schema

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| title | string | Yes | 1-200 characters | Task title |
| description | string | No | Max 2000 characters | Task description |
| completed | boolean | Yes | - | Completion status |

### Response: 200 OK

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Buy groceries and snacks",
  "description": "Milk, bread, eggs, chips",
  "completed": false,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-02-05T10:30:00Z",
  "updated_at": "2026-02-05T11:00:00Z"
}
```

### Response: 404 Not Found

```json
{
  "detail": "Task not found"
}
```

---

## PATCH /tasks/{id}

Partially update a task. Only provided fields are updated.

### Request

```http
PATCH /api/v1/tasks/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "completed": true
}
```

### Request Schema

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| title | string | No | 1-200 characters | Task title |
| description | string | No | Max 2000 characters | Task description |
| completed | boolean | No | - | Completion status |

### Response: 200 OK

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": true,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-02-05T10:30:00Z",
  "updated_at": "2026-02-05T11:30:00Z"
}
```

### Response: 404 Not Found

```json
{
  "detail": "Task not found"
}
```

---

## DELETE /tasks/{id}

Delete a task.

### Request

```http
DELETE /api/v1/tasks/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <access_token>
```

### Response: 204 No Content

No response body.

### Response: 404 Not Found

```json
{
  "detail": "Task not found"
}
```

---

## Common Response Schemas

### Task Object

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique task identifier |
| title | string | Task title (1-200 chars) |
| description | string \| null | Task description (max 2000 chars) |
| completed | boolean | Whether task is complete |
| user_id | UUID | Owner's user ID |
| created_at | ISO 8601 datetime | Creation timestamp |
| updated_at | ISO 8601 datetime | Last update timestamp |

### Error Object

| Field | Type | Description |
|-------|------|-------------|
| detail | string \| array | Error message or validation errors |

---

## Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | BAD_REQUEST | Invalid request parameters |
| 401 | UNAUTHORIZED | Missing or invalid authentication |
| 404 | NOT_FOUND | Task not found or access denied |
| 422 | VALIDATION_ERROR | Request body failed validation |
| 500 | INTERNAL_ERROR | Server error |

---

## Rate Limiting

Not implemented in Phase II. Consider for future phases if abuse is detected.

---

## Examples

### Create and complete a task flow

```bash
# 1. Create task
curl -X POST https://api.example.com/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn FastAPI"}'

# Response: {"id": "abc-123", ...}

# 2. Mark as complete
curl -X PATCH https://api.example.com/api/v1/tasks/abc-123 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 3. List all tasks
curl https://api.example.com/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN"
```
