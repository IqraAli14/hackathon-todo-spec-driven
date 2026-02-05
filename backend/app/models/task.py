from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class TaskBase(SQLModel):
    """Base task model with shared fields."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """Task database model."""

    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(max_length=36, index=True)  # VARCHAR from Better Auth
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
