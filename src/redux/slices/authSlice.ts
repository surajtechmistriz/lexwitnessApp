import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  isLoggedIn: boolean;
  user: any | null;
  token: string | null;
  subscription: any | null;
  isHydrated: boolean;
};

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  subscription: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: any;
        token: string;
        subscription: any;
      }>
    ) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.subscription = action.payload.subscription;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.subscription = null;
    },

    hydrateAuth: (
      state,
      action: PayloadAction<{
        user: any;
        token: string;
        subscription: any;
      } | null>
    ) => {
      if (action.payload) {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.subscription = action.payload.subscription;
      }

      state.isHydrated = true;
    },
  },
});

export const {
  loginSuccess,
  logout,
  hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;