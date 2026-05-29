import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMenu } from '../../services/api/category';
import { getCache, setCache } from '../../utils/cache';

const CACHE_KEY = 'TOP_MENU';

export const fetchMenu = createAsyncThunk(
  'category/fetchMenu',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Try cache first
      const cached = await getCache(CACHE_KEY);

      if (cached?.length) {
        return cached;
      }

      // 2. API call
      const data = await getMenu();

      // 3. Save cache
      await setCache(CACHE_KEY, data);

      return data;
    } catch (err) {
      // 4. fallback cache on failure
      const cached = await getCache(CACHE_KEY);

      if (cached?.length) {
        return cached;
      }

      return rejectWithValue(err);
    }
  },
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    menuItems: [],
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMenu.pending, state => {
        state.loading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.menuItems = action.payload;
        state.loading = false;
      })
      .addCase(fetchMenu.rejected, state => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;