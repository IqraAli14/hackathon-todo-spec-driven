# Research: In-Memory Console Todo Application

**Feature**: 001-todo-app
**Date**: 2026-02-04
**Status**: Complete

## Research Questions

### Q1: Best approach for in-memory task storage in Python?

**Decision**: Python `list` with `dataclass` objects

**Rationale**:
- `dataclass` provides clean, typed data structure with minimal boilerplate
- Built into Python 3.7+ (stdlib, no dependencies)
- Automatic `__init__`, `__repr__`, `__eq__` generation
- Type hints for IDE support and documentation
- `list` is simple, sufficient for <100 items

**Alternatives Considered**:
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Plain dict | Fast key lookup | No type safety, verbose | Harder to maintain, no structure |
| NamedTuple | Immutable, typed | Immutable (updates create new objects) | Need mutable completed status |
| Custom class | Full control | More boilerplate | dataclass does this better |
| SQLite :memory: | SQL queries | External-ish, overkill | Constitution prohibits DB |

---

### Q2: CLI input parsing approach?

**Decision**: `shlex.split()` for tokenization + manual command routing

**Rationale**:
- `shlex` handles quoted strings properly (stdlib)
- Simple command structure doesn't need argparse complexity
- Manual routing keeps code flat and readable
- Easy to add help text inline

**Alternatives Considered**:
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| argparse | Full-featured, subcommands | Overkill for REPL loop | Over-engineering for simple commands |
| click | Excellent UX | External dependency | Constitution prohibits external deps |
| Manual split() | Simplest | Breaks quoted strings | "Buy groceries" becomes two args |
| cmd module | Built-in REPL | More complex setup | shlex + loop is simpler |

---

### Q3: How to handle sequential IDs that survive deletion?

**Decision**: Instance variable counter in `TaskService`, only increments

**Rationale**:
- Counter stored as `_next_id: int` starting at 1
- Each `add()` uses current value, then increments
- Delete never decrements counter
- Simple, predictable, meets spec requirement

**Implementation Pattern**:
```python
class TaskService:
    def __init__(self):
        self._tasks: list[Task] = []
        self._next_id: int = 1

    def add(self, title: str, description: str = "") -> Task:
        task = Task(id=self._next_id, title=title, ...)
        self._next_id += 1  # Never decremented
        self._tasks.append(task)
        return task
```

---

### Q4: Output formatting for task list?

**Decision**: Simple tabular format with status indicators

**Rationale**:
- Human-readable without external formatting libraries
- Status shown as `[x]` (complete) or `[ ]` (incomplete)
- Fixed-width ID column for alignment
- Description on separate line if present (optional)

**Format Example**:
```text
Tasks:
  ID  Status  Title
  --  ------  -----
   1  [ ]     Buy groceries
   2  [x]     Fix bug
   3  [ ]     Write tests
```

---

### Q5: Error handling pattern?

**Decision**: Exception-free service layer, error returns in CLI

**Rationale**:
- Service methods return `Task | None` or `bool`
- CLI layer interprets None/False as error condition
- User-friendly messages generated at CLI layer
- No exception propagation = simpler control flow

**Pattern**:
```python
# Service
def get_task(self, task_id: int) -> Task | None:
    for task in self._tasks:
        if task.id == task_id:
            return task
    return None  # Not found

# CLI
task = service.get_task(task_id)
if task is None:
    print(f"Error: Task {task_id} not found")
```

---

## Technology Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data structure | dataclass | Type-safe, stdlib, minimal code |
| Storage | list[Task] | Simple, sufficient for scale |
| ID management | Counter (never decrements) | Meets spec, predictable |
| CLI parsing | shlex.split() | Handles quotes, stdlib |
| Command routing | Manual if/elif | Simple, readable |
| Error handling | Return None/False | No exceptions, explicit |
| Output format | Simple text table | Human-readable, no deps |

## Research Complete

All technical questions resolved. No NEEDS CLARIFICATION items remain.
Ready for Phase 1: Data Model and Contracts.
