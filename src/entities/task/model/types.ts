export type TaskCategory = "bug" | "feature" | "documentation" | "refactor" | "test";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
} 

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthData {
  username: string;
  password: string;
}