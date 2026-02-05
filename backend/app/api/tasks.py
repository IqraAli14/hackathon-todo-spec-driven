from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.database import get_db
from app.schemas import (
    TaskCreate,
    TaskListResponse,
    TaskRead,
    TaskReplace,
    TaskUpdate,
)
from app.services import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


def get_task_service(db: AsyncSession = Depends(get_db)) -> TaskService:
    """Dependency to get TaskService instance."""
    return TaskService(db)


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    completed: Optional[bool] = None,
    limit: int = 50,
    offset: int = 0,
    user_id: str = Depends(get_current_user_id),
    service: TaskService = Depends(get_task_service),
) -> TaskListResponse:
    """List all tasks for the authenticated user."""
    tasks, total = await service.list(
        user_id=user_id,
        completed=completed,
        limit=limit,
        offset=offset,
    )
    return TaskListResponse(
        tasks=[TaskRead.model_validate(t) for t in tasks],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    data: TaskCreate,
    user_id: str = Depends(get_current_user_id),
    service: TaskService = Depends(get_task_service),
) -> TaskRead:
    """Create a new task for the authenticated user."""
    task = await service.create(user_id=user_id, data=data)
    return TaskRead.model_validate(task)


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: UUID,
    user_id: str = Depends(get_current_user_id),
    service: TaskService = Depends(get_task_service),
) -> TaskRead:
    """Get a specific task by ID."""
    task = await service.get_by_id(task_id=task_id, user_id=user_id)
    if not task:
        # Return 404 for both "not found" and "wrong user" (FR-015)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskRead.model_validate(task)


@router.put("/{task_id}", response_model=TaskRead)
async def replace_task(
    task_id: UUID,
    data: TaskReplace,
    user_id: str = Depends(get_current_user_id),
    service: TaskService = Depends(get_task_service),
) -> TaskRead:
    """Replace a task entirely."""
    update_data = TaskUpdate(
        title=data.title,
        description=data.description,
        completed=data.completed,
    )
    task = await service.update(task_id=task_id, user_id=user_id, data=update_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskRead.model_validate(task)


@router.patch("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: UUID,
    data: TaskUpdate,
    user_id: str = Depends(get_current_user_id),
    service: TaskService = Depends(get_task_service),
) -> TaskRead:
    """Partially update a task."""
    task = await service.update(task_id=task_id, user_id=user_id, data=data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskRead.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    user_id: str = Depends(get_current_user_id),
    service: TaskService = Depends(get_task_service),
) -> None:
    """Delete a task."""
    deleted = await service.delete(task_id=task_id, user_id=user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
