// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/* ---------------- TYPES ---------------- */

type Subscription = {
  id: number;
  plan_id: number;
  plan: any;
  status: 'ACTIVE' | 'EXPIRED' | string;
  start_date: string;
  end_date: string;
  amount: number;
  total_amount: number;
  purchase_type: 'NEW' | 'RENEW' | 'UPGRADE';
  next_subscription?: Subscription | null;
};

type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  user: any | null;
  subscription: any | null;
  nextSubscriptions: any[];
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
};

/* ---------------- INITIAL STATE ---------------- */

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
  subscription: null,
  nextSubscriptions: [],
  isHydrated: false,
  isLoading: false,
  error: null,
};

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    //  Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    //  Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    //  Set profile (after refresh)
    setProfile: (
      state,
      action: PayloadAction<{
        user: any;
        subscription: any;
        nextSubscriptions: any[];
      }>
    ) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.subscription = action.payload.subscription;
      state.nextSubscriptions = action.payload.nextSubscriptions;
      state.isHydrated = true;
    },

    //  Login success
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: any;
        token: string;
        subscription: Subscription;
        nextSubscriptions?: any[];
      }>
    ) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.subscription = action.payload.subscription;
      state.nextSubscriptions = action.payload.nextSubscriptions || [];
      state.isHydrated = true;
    },

    //  Hydrate auth (from AsyncStorage)
    hydrateAuth: (
      state,
      action: PayloadAction<{
        user: any;
        token: string;
        subscription: Subscription;
        nextSubscriptions?: any[];
      } | null>
    ) => {
      if (action.payload) {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.subscription = action.payload.subscription;
        state.nextSubscriptions = action.payload.nextSubscriptions || [];
      }
      state.isHydrated = true;
    },

    //  Set subscription
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = action.payload;
    },

    //  Update subscription
    updateSubscription: (state, action: PayloadAction<Partial<Subscription>>) => {
      if (!state.subscription) return;
      state.subscription = { ...state.subscription, ...action.payload };
    },

    //  Set next subscriptions
    setNextSubscriptions: (state, action: PayloadAction<any[]>) => {
      state.nextSubscriptions = action.payload;
    },

    //  Add next subscription
    addNextSubscription: (state, action: PayloadAction<any>) => {
      state.nextSubscriptions.push(action.payload);
    },

    //  Remove next subscription
    removeNextSubscription: (state, action: PayloadAction<number>) => {
      state.nextSubscriptions = state.nextSubscriptions.filter(
        (sub) => sub.id !== action.payload
      );
    },

    //  Logout
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.subscription = null;
      state.nextSubscriptions = [];
      state.isHydrated = true;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setProfile,
  loginSuccess,
  hydrateAuth,
  setSubscription,
  updateSubscription,
  setNextSubscriptions,
  addNextSubscription,
  removeNextSubscription,
  logout,
} = authSlice.actions;

export default authSlice.reducer;