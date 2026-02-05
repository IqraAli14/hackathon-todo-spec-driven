# CLI Contract: Todo Application

**Feature**: 001-todo-app
**Type**: Command-Line Interface

## Command Contracts

### ADD - Create Task
**Command**: `add <title> [description]`
**Output (Success)**: `Task {id} created: {title}`
**Output (Error)**: `Error: Title cannot be empty`

### LIST - View All Tasks
**Command**: `list`
**Output (With Tasks)**:
```
Tasks:
  ID  Status  Title
  --  ------  -----
   1  [ ]     Task title
```
**Output (Empty)**: `No tasks yet. Add one to get started!`

### DONE - Mark Complete
**Command**: `done <id>`
**Output (Success)**: `Task {id} marked complete`
**Output (Error)**: `Error: Task {id} not found`

### UNDONE - Mark Incomplete
**Command**: `undone <id>`
**Output (Success)**: `Task {id} marked incomplete`

### UPDATE - Modify Task
**Command**: `update <id> <title> [description]`
**Output (Success)**: `Task {id} updated`

### DELETE - Remove Task
**Command**: `delete <id>`
**Output (Success)**: `Task {id} deleted`

### HELP - Show Commands
**Command**: `help`

### EXIT - Quit Application
**Command**: `exit` or `quit`
**Output**: `Goodbye!`

## General Behaviors
- Commands are case-insensitive
- Quoted strings for titles with spaces
- Prompt format: `> `
