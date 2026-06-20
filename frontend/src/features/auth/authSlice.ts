import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoginResponse } from './types/auth.types';


interface AuthState {
  accessToken: string | null;
  employeeId: string | null;
  userId: string | null;
  isFirstLogin: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  employeeId: null,
  userId: null,
  isFirstLogin: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
      state.accessToken = action.payload.accessToken;
      state.employeeId = action.payload.data.employeeId;
      state.userId = action.payload.data.userId;
      state.isFirstLogin = action.payload.isFirstLogin;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.accessToken = null;
      state.employeeId = null;
      state.userId = null;
      state.isFirstLogin = false;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;