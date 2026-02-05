"use client";

import { useState } from "react";
import type { Task } from "@/types";
import { Button } from "@/components/ui/Button";
import { TaskForm } from "@/components/TaskForm";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (id: string, data: { title: string; description?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsTogglingStatus(true);
    try {
      await onToggle(task.id, !task.completed);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleUpdate = async (data: { title: string; description?: string }) => {
    await onUpdate(task.id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isEditing) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <TaskForm
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          initialTitle={task.title}
          initialDescription={task.description || ""}
          submitLabel="Save"
          isEditing
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          disabled={isTogglingStatus}
          className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
            task.completed
              ? "border-primary-600 bg-primary-600 text-white"
              : "border-gray-300 hover:border-primary-500"
          }`}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed && (
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-medium ${
              task.completed ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`mt-1 text-sm ${
                task.completed ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Created {new Date(task.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Delete task"
          >
            Delete
          </Button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="mt-4 rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-800">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
