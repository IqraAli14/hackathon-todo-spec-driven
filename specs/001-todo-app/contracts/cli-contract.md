# CLI Contract: Todo Application

**Feature**: 001-todo-app
**Type**: Command-Line Interface
**Date**: 2026-02-04

## Overview

This document defines the contract for the Todo Application CLI. Since this is a console application (not a REST API), the contract specifies command formats, inputs, outputs, and behaviors.

## Command Contracts

### ADD - Create Task

**Command**: `add <title> [description]`

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| title | string | Yes | Non-empty, max 200 chars, trimmed |
| description | string | No | Any string |

**Output (Success)**:
```text
Task {id} created: {title}
```

**Output (Error)**:
```text
Error: Title cannot be empty
```

**Behavior**:
- Title is trimmed before validation
- ID assigned sequentially from 1
- Description defaults to empty string if omitted

---

### LIST - View All Tasks

**Command**: `list`

**Input**: None

**Output (With Tasks)**:
```text
Tasks:
  ID  Status  Title
  --  ------  -----
   {id}  [{status}]  {title}
   ...
```
Where `{status}` is `x` (complete) or ` ` (space, incomplete)

**Output (Empty)**:
```text
No tasks yet. Add one to get started!
```

**Behavior**:
- Tasks displayed in ID order (ascending)
- Description shown below title if present (optional display)

---

### DONE - Mark Complete

**Command**: `done <id>`

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| id | integer | Yes | Positive integer |

**Output (Success)**:
```text
Task {id} marked complete
```

**Output (Error - Invalid ID)**:
```text
Error: Invalid task ID. Please enter a positive number.
```

**Output (Error - Not Found)**:
```text
Error: Task {id} not found
```

**Behavior**:
- Idempotent: marking complete task as complete succeeds silently

---

### UNDONE - Mark Incomplete

**Command**: `undone <id>`

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| id | integer | Yes | Positive integer |

**Output (Success)**:
```text
Task {id} marked incomplete
```

**Output (Error - Invalid ID)**:
```text
Error: Invalid task ID. Please enter a positive number.
```

**Output (Error - Not Found)**:
```text
Error: Task {id} not found
```

**Behavior**:
- Idempotent: marking incomplete task as incomplete succeeds silently

---

### UPDATE - Modify Task

**Command**: `update <id> <title> [description]`

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| id | integer | Yes | Positive integer |
| title | string | Yes | Non-empty, max 200 chars, trimmed |
| description | string | No | Any string (replaces existing) |

**Output (Success)**:
```text
Task {id} updated
```

**Output (Error - Invalid ID)**:
```text
Error: Invalid task ID. Please enter a positive number.
```

**Output (Error - Not Found)**:
```text
Error: Task {id} not found
```

**Output (Error - Empty Title)**:
```text
Error: Title cannot be empty
```

**Behavior**:
- Title always required (even for description-only update, pass existing title)
- Description omitted = description unchanged
- Description provided = description replaced

---

### DELETE - Remove Task

**Command**: `delete <id>`

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| id | integer | Yes | Positive integer |

**Output (Success)**:
```text
Task {id} deleted
```

**Output (Error - Invalid ID)**:
```text
Error: Invalid task ID. Please enter a positive number.
```

**Output (Error - Not Found)**:
```text
Error: Task {id} not found
```

**Behavior**:
- Deleted ID is never reused
- Operation is permanent (no undo)

---

### HELP - Show Commands

**Command**: `help`

**Input**: None

**Output**:
```text
Todo Application Commands:
  add <title> [description]  - Add a new task
  list                       - Show all tasks
  done <id>                  - Mark task complete
  undone <id>                - Mark task incomplete
  update <id> <title> [desc] - Update task
  delete <id>                - Delete task
  help                       - Show this help
  exit / quit                - Exit application
```

---

### EXIT - Quit Application

**Command**: `exit` or `quit`

**Input**: None

**Output**:
```text
Goodbye!
```

**Behavior**:
- Application terminates gracefully
- All in-memory data is lost

---

## General Behaviors

### Unknown Command

**Input**: Any unrecognized command

**Output**:
```text
Error: Unknown command '{command}'. Type 'help' for available commands.
```

### Empty Input

**Input**: Empty line or whitespace only

**Behavior**: Re-prompt without error message

### Case Sensitivity

- Commands are **case-insensitive**: `ADD`, `Add`, `add` all work
- Task titles and descriptions preserve original case

### Prompt Format

```text
>
```
(Greater-than symbol followed by space)

### Quoted String Handling

- Titles with spaces must be quoted: `add "Buy groceries"`
- Double quotes preferred, single quotes acceptable
- Unquoted multi-word arguments split on whitespace
