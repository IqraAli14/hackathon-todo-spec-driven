# Implementation Plan: In-Memory Console Todo Application

**Branch**: `001-todo-app` | **Date**: 2026-02-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-app/spec.md`

## Summary

Build a single-user, in-memory todo application with a command-line interface. The application supports 5 core operations: add, view, update, delete, and toggle task completion status. Tasks are stored in memory using Python dataclasses, with sequential integer IDs that are never reused. The CLI provides a simple command-based interface with clear feedback and error handling.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: None (standard library only per constitution)
**Storage**: In-memory (Python list + dataclass)
**Testing**: unittest (stdlib) - manual testing for Phase I
**Target Platform**: Cross-platform (Linux/macOS/Windows console)
**Project Type**: Single project
**Performance Goals**: <1 second response time for all operations
**Constraints**: No external dependencies, no persistence, single user
**Scale/Scope**: Single session, typical usage <100 tasks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Spec-Driven Development | ✅ PASS | Plan follows approved spec.md |
| II. No Manual Code Writing | ✅ PASS | Code via /sp.implement only |
| III. Python Best Practices | ✅ PASS | dataclass, type hints, PEP 8 planned |
| IV. Simplicity Over Cleverness | ✅ PASS | Flat structure, no abstractions |
| V. CLI Usability | ✅ PASS | Command-based with help |
| VI. Clear Acceptance Criteria | ✅ PASS | 19 Given-When-Then scenarios in spec |
| VII. Incremental Task IDs | ✅ PASS | Sequential from 1, never reused |
| VIII. Phase I Scope | ✅ PASS | In-memory, stdlib only, no extras |
| IX. Hackathon II Compliance | ✅ PASS | Full SDD workflow followed |

**Gate Result**: ALL PASS - Proceeding to design.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-app/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 research
├── data-model.md        # Entity definitions
├── quickstart.md        # Usage guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── __init__.py          # Package marker
├── __main__.py          # Entry point (python -m src)
├── models/
│   ├── __init__.py
│   └── task.py          # Task dataclass
├── services/
│   ├── __init__.py
│   └── task_service.py  # Business logic (CRUD + toggle)
└── cli/
    ├── __init__.py
    ├── app.py           # Main CLI loop
    ├── commands.py      # Command handlers
    └── display.py       # Output formatting

tests/
├── __init__.py
├── test_task.py         # Task model tests
├── test_task_service.py # Service tests
└── test_cli.py          # CLI integration tests
```

**Structure Decision**: Single project layout selected. This is a simple CLI application with no web/mobile components. The modular structure separates concerns:
- `models/` - Data structures (Task dataclass)
- `services/` - Business logic (TaskService class)
- `cli/` - User interface (command loop, formatting)

## Architecture Design

### Module Responsibilities

| Module | Purpose | Dependencies |
|--------|---------|--------------|
| `models/task.py` | Task dataclass definition | None |
| `services/task_service.py` | CRUD operations, ID management | models.task |
| `cli/app.py` | Main loop, command routing | cli.commands |
| `cli/commands.py` | Command handlers | services.task_service |
| `cli/display.py` | Output formatting | models.task |

### Data Flow

```text
User Input → CLI App → Command Handler → Task Service → Task Model
                ↓
         Display Module ← Task Service (returns Task/list/error)
                ↓
         Formatted Output → User
```

### In-Memory Storage Design

```python
# In TaskService
class TaskService:
    _tasks: list[Task]       # Task storage
    _next_id: int            # Counter (starts at 1, never decrements)
```

**Key Design Decisions**:
1. **List storage**: Simple iteration for view, O(n) lookup by ID is acceptable for <100 tasks
2. **ID counter**: Class attribute, only increments, survives deletions
3. **No persistence**: Data lost on exit (per spec non-goal)

### CLI Command Design

| Command | Format | Description |
|---------|--------|-------------|
| `add` | `add <title> [description]` | Create new task |
| `list` | `list` | Show all tasks |
| `done` | `done <id>` | Mark task complete |
| `undone` | `undone <id>` | Mark task incomplete |
| `update` | `update <id> <title> [description]` | Modify task |
| `delete` | `delete <id>` | Remove task |
| `help` | `help` | Show commands |
| `exit` | `exit` or `quit` | Exit application |

**Input Handling**:
- Commands are case-insensitive
- Quoted strings for titles with spaces: `add "Buy groceries" "From the store"`
- ID validation: must be positive integer

### Error Handling Strategy

| Error Type | Handler | User Message |
|------------|---------|--------------|
| Empty title | Validation | "Error: Title cannot be empty" |
| Invalid ID format | Validation | "Error: Invalid task ID. Please enter a positive number." |
| Task not found | Service | "Error: Task {id} not found" |
| Unknown command | CLI | "Error: Unknown command. Type 'help' for available commands." |
| Empty input | CLI | Re-prompt (no error) |

**Principles**:
- All errors caught and displayed (no crashes)
- Messages include actionable guidance
- Application continues after errors

## Complexity Tracking

> No complexity violations. Design adheres to all constitution principles.

| Check | Status |
|-------|--------|
| External dependencies | ✅ None (stdlib only) |
| Unnecessary abstractions | ✅ None (direct implementation) |
| Over-engineering | ✅ None (flat, simple structure) |
| Scope creep | ✅ None (matches spec exactly) |
