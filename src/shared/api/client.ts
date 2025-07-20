import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Task, AuthData, AuthResponse } from '@entities/task/model/types';
import { testTasks } from './testTasks';
import Cookies from 'js-cookie';

// const API_URL = 'https://build-back-eosin.vercel.app/api';
const API_URL = 'http://localhost:3000/api';

class ApiClient {
  private api: AxiosInstance;
  private accessToken: string = '';
  private refreshToken: string = '';

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.api.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            throw refreshError;
          }
        }
        throw error;
      }
    );
  }

  async register(data: AuthData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/sign-up', data);
    return response.data;
  }

  async login(data: AuthData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', data);
    this.initializeFromStorage();
    return response.data
  }

  async refreshAccessToken(): Promise<AuthResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await this.api.post<AuthResponse>('/auth/refresh', {
      refresh_token: this.refreshToken
    });
    return response.data;
  }

  clearTokens(): void {
    this.accessToken = '';
    this.refreshToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  initializeFromStorage(): void {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    if (accessToken && refreshToken) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    }
  }

  async fetchTasks(): Promise<Task[]> {
    const response = await this.api.get<Task[]>('/tasks');
    return response.data;
  }

  async fetchTaskById(id: string): Promise<Task | undefined> {
    try {
      const response = await this.api.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const response = await this.api.post<Task>('/tasks', task);
    return response.data;
  }

  async updateTask(task: Task): Promise<Task> {
    const response = await this.api.patch<Task>(`/tasks/${task.id}`, task);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.api.delete(`/tasks/${id}`);
  }

  async deleteAllTasks(): Promise<void> {
    await this.api.delete('/tasks');
  }

  async createManyTasks(tasks: Task[]): Promise<void> {
    await this.api.post('/tasks/create-many', tasks);
  }

  async createTestTasks(): Promise<void> {
    await this.createManyTasks(testTasks);
  }
}

export const apiClient = new ApiClient();

apiClient.initializeFromStorage();
