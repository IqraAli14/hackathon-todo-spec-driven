# Data Model: In-Memory Console Todo Application

**Feature**: 001-todo-app
**Date**: 2026-02-04

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
from dataclasses import dataclass

@dataclass
class Task:
    """Represents a single todo item."""
    id: int
    title: str
    description: str = ""
    completed: bool = False
```

## Operations

- **Create (Add)**: Add task with title and optional description
- **Read (List)**: View all tasks sorted by ID
- **Update**: Modify title and/or description
- **Delete**: Remove task by ID (ID never reused)
- **Mark Complete/Incomplete**: Toggle completion status
