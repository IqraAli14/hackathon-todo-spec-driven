# Data Model: In-Memory Console Todo Application

**Feature**: 001-todo-app
**Date**: 2026-02-04
**Source**: [spec.md](./spec.md) Key Entities section

## Entities

### Task

Represents a single todo item in the application.

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| `id` | `int` | Yes | Auto-assigned | Positive integer, unique, immutable, sequential from 1 |
| `title` | `str` | Yes | - | 1-200 characters, non-empty, no whitespace-only |
| `description` | `str` | No | `""` | Optional, any length |
| `completed` | `bool` | Yes | `False` | True = complete, False = incomplete |

**Python Definition**:
```python
from dataclasses import dataclass, field

@dataclass
class Task:
    """Represents a single todo item."""
    id: int
    title: str
    description: str = ""
    completed: bool = False
```

**Validation Rules**:
- `id`: Assigned by system, never modified, never reused after deletion
- `title`: Must be stripped of leading/trailing whitespace before validation
- `title`: After stripping, must have length >= 1 and <= 200
- `description`: No validation (any string including empty)
- `completed`: Binary state, toggled via explicit operations

**State Transitions**:
```text
                   ┌─────────────┐
   add() ─────────►│  INCOMPLETE │
                   └──────┬──────┘
                          │
              mark_complete()
                          │
                          ▼
                   ┌─────────────┐
                   │  COMPLETE   │
                   └──────┬──────┘
                          │
            mark_incomplete()
                          │
                          ▼
                   ┌─────────────┐
                   │  INCOMPLETE │
                   └─────────────┘
```

---

### TaskService (Internal)

Manages the collection of tasks and ID assignment. Not a persisted entity.

| Field | Type | Purpose |
|-------|------|---------|
| `_tasks` | `list[Task]` | In-memory storage of all tasks |
| `_next_id` | `int` | Counter for sequential ID assignment (starts at 1) |

**Invariants**:
- `_next_id` only increments (never decrements, even on delete)
- All tasks in `_tasks` have unique IDs
- `_tasks` maintains insertion order (for display)

---

## Operations

### Create (Add)

**Input**: `title: str`, `description: str = ""`
**Output**: `Task` (newly created)
**Side Effects**:
- New Task added to `_tasks`
- `_next_id` incremented by 1

**Validation**:
- Title stripped and checked for non-empty
- Reject if title is empty or whitespace-only

---

### Read (View/List)

**Input**: None (list all) or `task_id: int` (single)
**Output**: `list[Task]` or `Task | None`
**Side Effects**: None

**Behavior**:
- List returns all tasks sorted by ID ascending
- Single lookup returns Task or None if not found

---

### Update

**Input**: `task_id: int`, `title: str | None`, `description: str | None`
**Output**: `Task | None`
**Side Effects**: Task fields modified in place

**Validation**:
- Task must exist (return None if not found)
- If title provided, must pass non-empty validation
- Only non-None fields are updated

---

### Delete

**Input**: `task_id: int`
**Output**: `bool` (success/failure)
**Side Effects**: Task removed from `_tasks`

**Behavior**:
- Returns True if task found and deleted
- Returns False if task not found
- ID is NOT reused (counter unchanged)

---

### Mark Complete / Incomplete

**Input**: `task_id: int`
**Output**: `Task | None`
**Side Effects**: `completed` field modified

**Behavior**:
- `mark_complete()`: Sets `completed = True`
- `mark_incomplete()`: Sets `completed = False`
- Idempotent: marking complete task as complete is valid (no-op)
- Returns None if task not found

---

## ID Assignment Example

```text
Action              | _next_id before | Task ID | _next_id after
--------------------|-----------------|---------|---------------
add("Task A")       | 1               | 1       | 2
add("Task B")       | 2               | 2       | 3
add("Task C")       | 3               | 3       | 4
delete(2)           | 4               | -       | 4 (unchanged)
add("Task D")       | 4               | 4       | 5
```

Note: After deleting Task 2, the next task gets ID 4, not ID 2.
