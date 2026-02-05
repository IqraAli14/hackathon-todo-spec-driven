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

## Project Structure

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
