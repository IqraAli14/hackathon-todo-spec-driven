from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)


class TaskUpdate(BaseModel):
    """Schema for updating an existing task (partial update)."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: Optional[bool] = None


class TaskReplace(BaseModel):
    """Schema for replacing a task (full update via PUT)."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool


class TaskRead(BaseModel):
    """Schema for reading a task (response)."""

    id: UUID
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TaskListResponse(BaseModel):
    """Schema for paginated task list response."""

    tasks: list[TaskRead]
    total: int
    limit: int
    offset: int
