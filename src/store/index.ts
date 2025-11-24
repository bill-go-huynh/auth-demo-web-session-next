import { configureStore } from '@reduxjs/toolkit';

import { env } from '@/config';

import { authReducer } from './features/auth';
import { taskReducer } from './features/tasks';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
  devTools: env.nodeEnv === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
