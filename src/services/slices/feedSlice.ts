import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getFeed = createAsyncThunk(
  'feed/getFeed',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

type TFeed = {
  orders: TOrdersData;
  loading: boolean;
  error: string | null;
};

const initialState: TFeed = {
  orders: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Произошла ошибка';
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
  },
  selectors: {
    orders: (state) => state.orders,
    loading: (state) => state.loading
  }
});

export const selectorsFeed = feedSlice.selectors;
