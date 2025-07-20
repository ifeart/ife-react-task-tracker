import { makeAutoObservable, runInAction } from "mobx";
import type { Task, TaskStatus, TaskCategory, TaskPriority } from "./types";
import { apiClient } from "@shared/api/client";
import type { AuthData } from "./types";
import Cookies from "js-cookie";


interface TaskFilter {
  status?: TaskStatus;
  category?: TaskCategory;
  priority?: TaskPriority;
  search?: string;
}

interface TaskSort {
  field: keyof Task;
  direction: "asc" | "desc";
}

export class TaskStore {
  tasks: Task[] = [];
  loading = false;
  isLoggedIn = false;
  error: string | null = null;
  filter: TaskFilter = {};
  sort: TaskSort = { field: "createdAt", direction: "desc" };
  
  constructor() {
    makeAutoObservable(this);
    this.isLoggedIn = !!Cookies.get("access_token");
  }

  get filteredTasks() {
    let filtered = this.tasks;

    if (this.filter.status) {
      filtered = filtered.filter(task => task.status === this.filter.status);
    }
    if (this.filter.category) {
      filtered = filtered.filter(task => task.category === this.filter.category);
    }
    if (this.filter.priority) {
      filtered = filtered.filter(task => task.priority === this.filter.priority);
    }
    if (this.filter.search) {
      const search = this.filter.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(search) || 
        task.description?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  get sortedTasks() {
    return [...this.filteredTasks].sort((a, b) => {
      const aValue = a[this.sort.field];
      const bValue = b[this.sort.field];
      
      if (aValue && bValue && aValue < bValue) return this.sort.direction === "asc" ? -1 : 1;
      if (aValue && bValue && aValue > bValue) return this.sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  setFilter = (filter: Partial<TaskFilter>) => {
    this.filter = { ...this.filter, ...filter };
  };

  setSort = (sort: TaskSort) => {
    this.sort = sort;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  fetchTasks = async () => {
    try {
      this.loading = true;
      const tasks = await apiClient.fetchTasks();
      runInAction(() => {
        this.tasks = tasks;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "error fetch tasks";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  fetchTaskById = async (id: string) => {
    try {
      this.loading = true;
      const taskFromStore = this.tasks.find(t => t.id === id);
      if (taskFromStore) {
        return taskFromStore;
      }
      const task = await apiClient.fetchTaskById(id);
      if (task) {
        runInAction(() => {
          const index = this.tasks.findIndex(t => t.id === id);
          if (index !== -1) {
            this.tasks[index] = task;
          } else {
            this.tasks.push(task);
          }
          this.error = null;
        });
      }
      return task;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "error fetch task";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  createTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      this.loading = true;
      const newTask = await apiClient.createTask(task);
      runInAction(() => {
        this.tasks.push(newTask);
        this.error = null;
      });
      return newTask;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "error create task";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateTask = async (task: Task) => {
    try {
      this.loading = true;
      const updatedTask = await apiClient.updateTask(task);
      runInAction(() => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.error = null;
      });
      return updatedTask;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "error update task";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteTask = async (id: string) => {
    try {
      this.loading = true;
      await apiClient.deleteTask(id);
      runInAction(() => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "error delete task";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteAllTasks = async () => {
    try {
      this.loading = true;
      await apiClient.deleteAllTasks();
      runInAction(() => {
        this.tasks = [];
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "error delete all tasks";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  markTaskAsDone = async (id: string) => {
    try {
      this.loading = true;
      const updatedTask = await this.updateTask({
        ...this.tasks.find(t => t.id === id)!,
        status: "done"
      });
      runInAction(() => {
        this.error = null;
      });
      return updatedTask;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "error task to done";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  createTestTasks = async () => {
    try {
      this.loading = true;
      await apiClient.createTestTasks();
      await this.fetchTasks();
      runInAction(() => {
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "error create test tasks";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  login = async (payload: AuthData) => {
    try {
      const response = await apiClient.login(payload);
      await Cookies.set("access_token", response.access_token, {
        expires: 1 / 24,
      });
      await Cookies.set("refresh_token", response.refresh_token, {
        expires: 7,
      });
      await apiClient.initializeFromStorage();
      this.isLoggedIn = true;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "error to login";
      });
    }
  };

  signUp = async (payload: AuthData) => {
    try {
      const response = await apiClient.register(payload);
      await Cookies.set("access_token", response.access_token, {
        expires: 1 / 24,
      });
      await  Cookies.set("refresh_token", response.refresh_token, {
        expires: 7,
      });
      this.isLoggedIn = true;
      await apiClient.initializeFromStorage();
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "error sign up";
      });
    }
  }

  logout = () => {
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    this.isLoggedIn = false;
    this.tasks = [];
    this.filter = {};
  }

  ifLoggedIn = () => {
    return this.isLoggedIn;
  }
}
export const taskStore = new TaskStore(); 