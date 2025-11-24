import type { User } from '@/types';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string;
}
