# Quickstart: Todo Application

**Feature**: 001-todo-app
**Version**: Phase I (In-Memory)

## Prerequisites

- Python 3.13 or later
- Terminal/Console access

## Running the Application

```bash
# From repository root
python -m src

# Or run directly
python src/__main__.py
```

## Available Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `add` | `add <title> [description]` | Create a new task |
| `list` | `list` | Show all tasks |
| `done` | `done <id>` | Mark task as complete |
| `undone` | `undone <id>` | Mark task as incomplete |
| `update` | `update <id> <title> [description]` | Update task details |
| `delete` | `delete <id>` | Remove a task |
| `help` | `help` | Show this help |
| `exit` | `exit` or `quit` | Exit application |

## Usage Examples

### Adding Tasks

```text
> add "Buy groceries"
Task 1 created: Buy groceries

> add "Fix bug" "Memory leak in parser module"
Task 2 created: Fix bug
```

### Viewing Tasks

```text
> list
Tasks:
  ID  Status  Title
  --  ------  -----
   1  [ ]     Buy groceries
   2  [ ]     Fix bug
```

### Completing Tasks

```text
> done 1
Task 1 marked complete

> list
Tasks:
  ID  Status  Title
  --  ------  -----
   1  [x]     Buy groceries
   2  [ ]     Fix bug
```

## Tips

1. **Quoted Titles**: Use quotes for titles with spaces: `add "Buy milk"`
2. **Case Insensitive**: Commands work in any case: `ADD`, `Add`, `add`
3. **IDs are Permanent**: Task IDs are never reused, even after deletion
4. **No Persistence**: Tasks are lost when you exit (this is Phase I)
