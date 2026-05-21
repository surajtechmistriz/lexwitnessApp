import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------------- TYPES ---------------- */

type Subscription = {
  id: number;
  plan_id: number;
  plan: any;

  status: "ACTIVE" | "EXPIRED" | string;

  start_date: string;
  end_date: string;

  amount: number;
  total_amount: number;

  purchase_type: "NEW" | "RENEW" | "UPGRADE";

  next_subscription?: Subscription | null;
};

type AuthState = {
  isLoggedIn: boolean;
  user: any | null;
  token: string | null;
  subscription: Subscription | null;
  isHydrated: boolean;
};

/* ---------------- INITIAL STATE ---------------- */

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  subscription: null,
  isHydrated: false,
};

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
reducers: {
  /* login */
  loginSuccess: (
    state,
    action: PayloadAction<{
      user: any;
      token: string;
      subscription: Subscription;
    }>
  ) => {
    state.isLoggedIn = true;
    state.user = action.payload.user;
    state.token = action.payload.token;
    state.subscription = action.payload.subscription;
  },

  /* logout */
  logout: (state) => {
    state.isLoggedIn = false;
    state.user = null;
    state.token = null;
    state.subscription = null;
  },

  /* hydration */
  hydrateAuth: (
    state,
    action: PayloadAction<{
      user: any;
      token: string;
      subscription: Subscription;
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

  /* full replace */
  setSubscription(
    state,
    action: PayloadAction<Subscription>,
  ) {
    state.subscription = action.payload;
  },

  /* partial update */
  updateSubscription(
    state,
    action: PayloadAction<Partial<Subscription>>,
  ) {
    if (!state.subscription) return;

    state.subscription = {
      ...state.subscription,
      ...action.payload,
    };
  },
},
});

export const {
  loginSuccess,
  logout,
  hydrateAuth,
  setSubscription,
  updateSubscription,
} = authSlice.actions;

export default authSlice.reducer;