"""Display formatting for CLI output."""

from src.models.task import Task


def format_task(task: Task) -> str:
    """Format a single task for display."""
    status = "x" if task.completed else " "
    return f"  {task.id:3}  [{status}]     {task.title}"


def format_task_list(tasks: list[Task]) -> str:
    """Format a list of tasks for display."""
    if not tasks:
        return "No tasks yet. Add one to get started!"

    lines = [
        "Tasks:",
        "  ID  Status  Title",
        "  --  ------  -----",
    ]
    for task in tasks:
        lines.append(format_task(task))
    return "\n".join(lines)
