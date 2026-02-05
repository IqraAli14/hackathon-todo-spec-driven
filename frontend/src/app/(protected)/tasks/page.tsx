"use client";

import { useState, useEffect, useCallback } from "react";
import type { Task } from "@/types";
import { listTasks, createTask, updateTask, deleteTask } from "@/lib/api";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const response = await listTasks();
      setTasks(response.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (data: { title: string; description?: string }) => {
    try {
      setError(null);
      const newTask = await createTask(data);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed } : task
      )
    );

    try {
      setError(null);
      await updateTask(id, { completed });
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleUpdateTask = async (
    id: string,
    data: { title: string; description?: string }
  ) => {
    try {
      setError(null);
      const updatedTask = await updateTask(id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
      throw err;
    }
  };

  const handleDeleteTask = async (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);

    // Optimistic update
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      setError(null);
      await deleteTask(id);
    } catch (err) {
      // Revert on error
      if (taskToDelete) {
        setTasks((prev) => [...prev, taskToDelete]);
      }
      setError(err instanceof Error ? err.message : "Failed to delete task");
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Add New Task</h2>
        </CardHeader>
        <CardContent>
          <TaskForm onSubmit={handleCreateTask} />
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Your Tasks ({tasks.length})
        </h2>
        <TaskList
          tasks={tasks}
          onToggle={handleToggleTask}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}
