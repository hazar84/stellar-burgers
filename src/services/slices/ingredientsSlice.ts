import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

type TIngredientState = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientState = {
  ingredients: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Произошла ошибка';
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  },
  selectors: {
    ingredients: (state) => state.ingredients,
    loading: (state) => state.loading
  }
});

export const selectorsIngredients = ingredientsSlice.selectors;
