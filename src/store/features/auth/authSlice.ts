import { type Action, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { ERRORS } from '@/constants';
import { authApi } from '@/services';
import type { LoginData } from '@/types';

import { handleFulfilled, handlePending, handleRejected } from '../../utils/reducers';
import type { AuthState } from './types';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: '',
};

export const loginWithPassword = createAsyncThunk(
  'auth/loginWithPassword',
  async (data: LoginData, { rejectWithValue, dispatch }) => {
    try {
      const response = await authApi.login(data);
      // After successful login, fetch user info
      await dispatch(fetchMe());
      return response.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : ERRORS.LOGIN_FAILED);
    }
  },
);

export const registerWithPassword = createAsyncThunk(
  'auth/registerWithPassword',
  async (data: LoginData & { name: string }, { rejectWithValue, dispatch }) => {
    try {
      await authApi.register(data);
      // After successful registration, login automatically
      const loginResponse = await authApi.login({ email: data.email, password: data.password });
      // Fetch user info after login
      await dispatch(fetchMe());
      return loginResponse.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : ERRORS.REGISTER_FAILED);
    }
  },
);

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.me();
    return response.user;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : ERRORS.UNAUTHORIZED);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    return null;
  } catch (error) {
    // Even if logout fails on server, clear local state
    return rejectWithValue(error instanceof Error ? error.message : ERRORS.LOGOUT_FAILED);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // loginWithPassword
      .addCase(loginWithPassword.pending, handlePending)
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.user = action.payload;
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        handleRejected(
          state,
          action as Action<string> & { payload?: unknown },
          ERRORS.LOGIN_FAILED,
        );
      })
      // registerWithPassword
      .addCase(registerWithPassword.pending, handlePending)
      .addCase(registerWithPassword.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.user = action.payload;
      })
      .addCase(registerWithPassword.rejected, (state, action) => {
        handleRejected(
          state,
          action as Action<string> & { payload?: unknown },
          ERRORS.REGISTER_FAILED,
        );
      })
      // fetchMe
      .addCase(fetchMe.pending, handlePending)
      .addCase(fetchMe.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        handleRejected(
          state,
          action as Action<string> & { payload?: unknown },
          ERRORS.UNAUTHORIZED,
        );
        state.user = null;
      })
      // logout
      .addCase(logout.pending, handlePending)
      .addCase(logout.fulfilled, (state) => {
        handleFulfilled(state);
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        // Clear user even if logout fails
        handleFulfilled(state);
        state.user = null;
        // Optionally show error message
        if (action.payload) {
          state.error = action.payload as string;
        }
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
