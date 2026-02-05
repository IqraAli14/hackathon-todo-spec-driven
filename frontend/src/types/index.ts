export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}
