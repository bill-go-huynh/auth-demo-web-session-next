import type { CreateTaskData, Task, UpdateTaskData } from '@/types';

import { fetchApi } from './fetch';

export const tasksApi = {
  getAll: async (): Promise<Task[]> => fetchApi<Task[]>('/tasks'),

  getOne: async (id: string): Promise<Task> => fetchApi<Task>(`/tasks/${id}`),

  create: async (data: CreateTaskData): Promise<Task> =>
    fetchApi<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: async (id: string, data: UpdateTaskData): Promise<Task> =>
    fetchApi<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: async (id: string): Promise<{ message: string } | null> =>
    fetchApi<{ message: string } | null>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};
