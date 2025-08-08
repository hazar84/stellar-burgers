import { configureStore, combineSlices } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsSlice } from './slices/ingredientsSlice';
import { feedSlice } from './slices/feedSlice';
import { burgerConstructorSlice } from './slices/burgerConstructorSlice';
import { orderSlice } from './slices/orderSlice';
import { userSlice } from './slices/userSlice';
import { ordersSlice } from './slices/ordersSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  feedSlice,
  burgerConstructorSlice,
  orderSlice,
  userSlice,
  ordersSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = () => dispatchHook();
export const useAppSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
