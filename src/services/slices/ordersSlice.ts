import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

type TOrders = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: TOrders = {
  orders: [],
  loading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || 'Ошибка при загрузке заказов';
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
  },
  selectors: {
    orders: (state) => state.orders,
    loading: (state) => state.loading
  }
});

export const selectorsOrders = ordersSlice.selectors;
