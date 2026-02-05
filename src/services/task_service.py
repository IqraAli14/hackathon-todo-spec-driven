"""Task service with business logic for CRUD operations."""

from src.models.task import Task


class TaskService:
    """Manages the collection of tasks and ID assignment."""

    def __init__(self) -> None:
        self._tasks: list[Task] = []
        self._next_id: int = 1

    def _get_task_by_id(self, task_id: int) -> Task | None:
        """Find a task by its ID."""
        for task in self._tasks:
            if task.id == task_id:
                return task
        return None

    def add_task(self, title: str, description: str = "") -> Task | None:
        """Create a new task with the given title and optional description.

        Returns the created Task, or None if title is invalid.
        """
        title = title.strip()
        if not title:
            return None

        task = Task(
            id=self._next_id,
            title=title,
            description=description,
        )
        self._tasks.append(task)
        self._next_id += 1
        return task

    def list_tasks(self) -> list[Task]:
        """Return all tasks sorted by ID ascending."""
        return sorted(self._tasks, key=lambda t: t.id)

    def mark_complete(self, task_id: int) -> Task | None:
        """Mark a task as complete. Returns the task or None if not found."""
        task = self._get_task_by_id(task_id)
        if task:
            task.completed = True
        return task

    def mark_incomplete(self, task_id: int) -> Task | None:
        """Mark a task as incomplete. Returns the task or None if not found."""
        task = self._get_task_by_id(task_id)
        if task:
            task.completed = False
        return task

    def update_task(
        self, task_id: int, title: str, description: str | None = None
    ) -> Task | None:
        """Update a task's title and optionally description.

        Returns the task, or None if not found or title invalid.
        """
        title = title.strip()
        if not title:
            return None

        task = self._get_task_by_id(task_id)
        if task is None:
            return None

        task.title = title
        if description is not None:
            task.description = description
        return task

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by ID. Returns True if deleted, False if not found."""
        task = self._get_task_by_id(task_id)
        if task:
            self._tasks.remove(task)
            return True
        return False
