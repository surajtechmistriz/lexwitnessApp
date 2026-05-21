import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------------- TYPES ---------------- */

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number | string;
  duration_value: number;
  duration_unit: string;
  tag?: string | null;
  is_featured?: number;
  status?: number;
}

type SubscriptionState = {
  plans: SubscriptionPlan[];
  selectedPlan: SubscriptionPlan | null;
};

/* ---------------- INITIAL STATE ---------------- */

const initialState: SubscriptionState = {
  plans: [],
  selectedPlan: null,
};

/* ---------------- SLICE ---------------- */

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    /* set all plans from API */
    setPlans(state, action: PayloadAction<SubscriptionPlan[]>) {
      state.plans = action.payload;
    },

    /* user selects a plan in UI */
    selectPlan(state, action: PayloadAction<SubscriptionPlan>) {
      state.selectedPlan = action.payload;
    },

    /* clear selected plan */
    clearSelectedPlan(state) {
      state.selectedPlan = null;
    },
  },
});

export const {
  setPlans,
  selectPlan,
  clearSelectedPlan,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;