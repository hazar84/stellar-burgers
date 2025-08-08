import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const postOrderBurger = createAsyncThunk(
  'order/postOrderBurger',
  async (data: string[], { rejectWithValue }) => {
    try {
      return await orderBurgerApi(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

type Order = {
  orderData: TOrder | null;
  errorOrderData: string | null;
  orderRequest: boolean;
  orderByNumber: TOrder | null;
  loadingOrderByNumber: boolean;
  errorOrderByNumber: string | null;
};

const initialState: Order = {
  orderData: null,
  errorOrderData: null,
  orderRequest: false,
  orderByNumber: null,
  loadingOrderByNumber: false,
  errorOrderByNumber: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetCreatOrder(state) {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrderBurger.pending, (state) => {
        state.errorOrderData = null;
        state.orderRequest = true;
      })
      .addCase(postOrderBurger.rejected, (state, action) => {
        state.errorOrderData =
          (action.payload as string) || 'Ошибка при создании заказа';
      })
      .addCase(postOrderBurger.fulfilled, (state, action) => {
        state.orderData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loadingOrderByNumber = true;
        state.errorOrderByNumber = null;
        state.orderRequest = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loadingOrderByNumber = false;
        state.errorOrderByNumber =
          (action.payload as string) || 'Ошибка при получении заказа';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loadingOrderByNumber = false;
        state.orderByNumber = action.payload;
        state.orderRequest = false;
      });
  },
  selectors: {
    orderByNumber: (state) => state.orderByNumber,
    loadingOrderByNumber: (state) => state.loadingOrderByNumber,
    orderRequest: (state) => state.orderRequest,
    orderData: (state) => state.orderData
  }
});

export const { resetCreatOrder } = orderSlice.actions;

export const selectorsOrder = orderSlice.selectors;
