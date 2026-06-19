import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DarkColors, LightColors } from '../../utils/constants/colors';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof LightColors;
}

// Load initial theme from storage
const loadTheme = (): ThemeMode => {
  // For React Native, we'll use the persisted state from redux-persist
  // This is just a fallback
  return 'light';
};

const initialState: ThemeState = {
  mode: 'light',
  colors: LightColors,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      state.colors = newMode === 'dark' ? DarkColors : LightColors;
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.colors = action.payload === 'dark' ? DarkColors : LightColors;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;