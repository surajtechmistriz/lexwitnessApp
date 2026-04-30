import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------------- TYPES ---------------- */

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number | string;
  duration_value: number;
  duration_unit: string;
  tag?: string | null;
  print_editions?: number;
  is_featured?: number;
  is_trial?: number;
  status?: number;
}

export interface SubscriptionState {
  selectedPlan: SubscriptionPlan | null;
  plans: SubscriptionPlan[];
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: SubscriptionState = {
  selectedPlan: null,
  plans: [],
};

/* ---------------- SLICE ---------------- */

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    /* SET ALL PLANS FROM API */
    setPlans(state, action: PayloadAction<SubscriptionPlan[]>) {
      state.plans = action.payload;
    },

    /* SELECT SINGLE PLAN */
    setSubscription(state, action: PayloadAction<SubscriptionPlan>) {
      state.selectedPlan = action.payload;
    },

    /* CLEAR SELECTION */
    clearSubscription(state) {
      state.selectedPlan = null;
    },
  },
});

export const { setPlans, setSubscription, clearSubscription } =
  subscriptionSlice.actions;

export default subscriptionSlice.reducer;