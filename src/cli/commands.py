"""Command handlers for CLI operations."""

from src.services.task_service import TaskService
from src.cli.display import format_task_list


def validate_id(id_str: str) -> int | None:
    """Validate and parse a task ID. Returns int or None if invalid."""
    try:
        task_id = int(id_str)
        if task_id <= 0:
            return None
        return task_id
    except ValueError:
        return None


def validate_title(title: str) -> str | None:
    """Validate a title. Returns stripped title or None if invalid."""
    title = title.strip()
    return title if title else None


def cmd_add(service: TaskService, args: list[str]) -> str:
    """Handle the 'add' command."""
    if not args:
        return "Error: Title cannot be empty"

    title = args[0]
    description = args[1] if len(args) > 1 else ""

    task = service.add_task(title, description)
    if task is None:
        return "Error: Title cannot be empty"

    return f"Task {task.id} created: {task.title}"


def cmd_list(service: TaskService, args: list[str]) -> str:
    """Handle the 'list' command."""
    tasks = service.list_tasks()
    return format_task_list(tasks)


def cmd_done(service: TaskService, args: list[str]) -> str:
    """Handle the 'done' command."""
    if not args:
        return "Error: Invalid task ID. Please enter a positive number."

    task_id = validate_id(args[0])
    if task_id is None:
        return "Error: Invalid task ID. Please enter a positive number."

    task = service.mark_complete(task_id)
    if task is None:
        return f"Error: Task {task_id} not found"

    return f"Task {task_id} marked complete"


def cmd_undone(service: TaskService, args: list[str]) -> str:
    """Handle the 'undone' command."""
    if not args:
        return "Error: Invalid task ID. Please enter a positive number."

    task_id = validate_id(args[0])
    if task_id is None:
        return "Error: Invalid task ID. Please enter a positive number."

    task = service.mark_incomplete(task_id)
    if task is None:
        return f"Error: Task {task_id} not found"

    return f"Task {task_id} marked incomplete"


def cmd_update(service: TaskService, args: list[str]) -> str:
    """Handle the 'update' command."""
    if not args:
        return "Error: Invalid task ID. Please enter a positive number."

    task_id = validate_id(args[0])
    if task_id is None:
        return "Error: Invalid task ID. Please enter a positive number."

    if len(args) < 2:
        return "Error: Title cannot be empty"

    title = args[1]
    if not validate_title(title):
        return "Error: Title cannot be empty"

    description = args[2] if len(args) > 2 else None

    # Check if task exists first
    if service._get_task_by_id(task_id) is None:
        return f"Error: Task {task_id} not found"

    task = service.update_task(task_id, title, description)
    if task is None:
        return "Error: Title cannot be empty"

    return f"Task {task_id} updated"


def cmd_delete(service: TaskService, args: list[str]) -> str:
    """Handle the 'delete' command."""
    if not args:
        return "Error: Invalid task ID. Please enter a positive number."

    task_id = validate_id(args[0])
    if task_id is None:
        return "Error: Invalid task ID. Please enter a positive number."

    if service.delete_task(task_id):
        return f"Task {task_id} deleted"
    return f"Error: Task {task_id} not found"


def cmd_help(service: TaskService, args: list[str]) -> str:
    """Handle the 'help' command."""
    return """Todo Application Commands:
  add <title> [description]  - Add a new task
  list                       - Show all tasks
  done <id>                  - Mark task complete
  undone <id>                - Mark task incomplete
  update <id> <title> [desc] - Update task
  delete <id>                - Delete task
  help                       - Show this help
  exit / quit                - Exit application"""
