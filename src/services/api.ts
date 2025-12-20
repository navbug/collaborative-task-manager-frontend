import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  LoginCredentials,
  RegisterData,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  ApiResponse,
  AuthResponse,
  Task,
  TasksResponse,
  User
} from '../types';

const API_URL = import.meta.env.VITE_API_URL;

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data!;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data!;
  }

  async updateProfile(data: { name?: string; email?: string }): Promise<User> {
    const response = await this.api.put<ApiResponse<User>>('/auth/profile', data);
    return response.data.data!;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.api.get<ApiResponse<User[]>>('/auth/users');
    return response.data.data!;
  }

  // Task APIs
  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await this.api.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data!;
  }

  async getTasks(filters?: TaskFilters): Promise<TasksResponse> {
    const response = await this.api.get<ApiResponse<TasksResponse>>('/tasks', {
      params: filters
    });
    return response.data.data!;
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await this.api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data!;
  }

  async getCreatedTasks(): Promise<Task[]> {
    const response = await this.api.get<ApiResponse<Task[]>>('/tasks/created');
    return response.data.data!;
  }

  async getAssignedTasks(): Promise<Task[]> {
    const response = await this.api.get<ApiResponse<Task[]>>('/tasks/assigned');
    return response.data.data!;
  }

  async getOverdueTasks(): Promise<Task[]> {
    const response = await this.api.get<ApiResponse<Task[]>>('/tasks/overdue');
    return response.data.data!;
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await this.api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data!;
  }

  async deleteTask(id: string): Promise<void> {
    await this.api.delete(`/tasks/${id}`);
  }
}

export const apiService = new ApiService();