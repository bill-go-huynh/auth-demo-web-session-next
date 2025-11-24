import type { LoginData, RegisterData, User } from '@/types';

import { fetchApi } from './fetch';

export const authApi = {
  register: async (data: RegisterData): Promise<User> =>
    fetchApi<User>('/auth/session/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: async (data: LoginData): Promise<{ user: User }> =>
    fetchApi<{ user: User }>('/auth/session/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: async (): Promise<{ message: string }> =>
    fetchApi<{ message: string }>('/auth/session/logout', {
      method: 'POST',
    }),

  me: async (): Promise<{ user: User }> => fetchApi<{ user: User }>('/auth/session/me'),
};
