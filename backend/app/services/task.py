from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from sqlmodel import select

from app.models import Task
from app.schemas import TaskCreate, TaskUpdate


class TaskService:
    """Service for task-related business logic."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: str, data: TaskCreate) -> Task:
        """Create a new task for a user."""
        task = Task(
            title=data.title,
            description=data.description,
            user_id=user_id,
        )
        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def list(
        self,
        user_id: str,
        completed: Optional[bool] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[Task], int]:
        """List all tasks for a user with optional filtering."""
        # Build query with user_id filter (CRITICAL: data isolation)
        query = select(Task).where(Task.user_id == user_id)

        if completed is not None:
            query = query.where(Task.completed == completed)

        # Count total before pagination
        count_query = select(func.count()).select_from(Task).where(Task.user_id == user_id)
        if completed is not None:
            count_query = count_query.where(Task.completed == completed)
        result = await self.db.execute(count_query)
        total = result.scalar() or 0

        # Apply pagination and ordering
        query = query.order_by(Task.created_at.desc()).offset(offset).limit(limit)
        result = await self.db.execute(query)
        tasks = result.scalars().all()

        return list(tasks), total

    async def get_by_id(self, task_id: UUID, user_id: str) -> Optional[Task]:
        """Get a specific task by ID for a user."""
        # Include user_id in WHERE to prevent unauthorized access (FR-014)
        query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def update(
        self, task_id: UUID, user_id: str, data: TaskUpdate
    ) -> Optional[Task]:
        """Update a task for a user."""
        task = await self.get_by_id(task_id, user_id)
        if not task:
            return None

        # Update only provided fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        task.updated_at = datetime.utcnow()
        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def delete(self, task_id: UUID, user_id: str) -> bool:
        """Delete a task for a user."""
        task = await self.get_by_id(task_id, user_id)
        if not task:
            return False

        await self.db.delete(task)
        await self.db.commit()
        return True
