"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateTaskTitle, validateTaskDescription } from "@/lib/validations";

interface TaskFormProps {
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  onCancel?: () => void;
  initialTitle?: string;
  initialDescription?: string;
  submitLabel?: string;
  isEditing?: boolean;
}

export function TaskForm({
  onSubmit,
  onCancel,
  initialTitle = "",
  initialDescription = "",
  submitLabel = "Add Task",
  isEditing = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const titleError = validateTaskTitle(title);
    if (titleError) {
      errors.title = titleError.message;
    }

    const descError = validateTaskDescription(description);
    if (descError) {
      errors.description = descError.message;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if (!isEditing) {
        // Clear form after creating new task
        setTitle("");
        setDescription("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (fieldErrors.title) {
            setFieldErrors((prev) => ({ ...prev, title: "" }));
          }
        }}
        placeholder="What needs to be done?"
        error={fieldErrors.title}
        maxLength={200}
        required
      />

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (fieldErrors.description) {
              setFieldErrors((prev) => ({ ...prev, description: "" }));
            }
          }}
          placeholder="Add more details..."
          maxLength={2000}
          rows={3}
          className={`block w-full rounded-lg border px-3 py-2 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            fieldErrors.description
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          }`}
        />
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {description.length}/2000 characters
        </p>
      </div>

      <div className="flex gap-2">
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
