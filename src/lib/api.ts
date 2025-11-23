import { env } from './env';
import type { User, Task, RegisterData, LoginData, CreateTaskData, UpdateTaskData } from '@/types';

const apiBaseUrl = env.apiBaseUrl;

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${apiBaseUrl}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // Response is not JSON, use status text or default message
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: async (data: RegisterData): Promise<User> => {
    return fetchApi<User>('/auth/session/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginData): Promise<{ user: User }> => {
    return fetchApi<{ user: User }>('/auth/session/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>('/auth/session/logout', {
      method: 'POST',
    });
  },

  me: async (): Promise<{ user: User }> => {
    return fetchApi<{ user: User }>('/auth/session/me');
  },
};

// Tasks API
export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    return fetchApi<Task[]>('/session/tasks');
  },

  getOne: async (id: string): Promise<Task> => {
    return fetchApi<Task>(`/session/tasks/${id}`);
  },

  create: async (data: CreateTaskData): Promise<Task> => {
    return fetchApi<Task>('/session/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateTaskData): Promise<Task> => {
    return fetchApi<Task>(`/session/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await fetchApi<void>(`/session/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

