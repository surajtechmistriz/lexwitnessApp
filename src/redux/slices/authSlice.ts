// src/redux/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  isLoggedIn: boolean;
  user: any | null;
  token: string | null;
  isHydrated: boolean;
};

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },

    hydrateAuth: (
      state,
      action: PayloadAction<{ user: any; token: string } | null>
    ) => {
      if (action.payload) {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      }
      state.isHydrated = true;
    },
  },
});

export const { loginSuccess, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;