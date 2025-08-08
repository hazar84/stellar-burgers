import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructor = {
  bun: TIngredient | null;
  ingredients: Array<TConstructorIngredient>;
};

const initialState: TConstructor = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        const { type } = payload;
        type === 'bun'
          ? (state.bun = payload)
          : state.ingredients.push(payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const item = action.payload;
      if (item > 0) {
        const ingredients = state.ingredients;
        [ingredients[item - 1], ingredients[item]] = [
          ingredients[item],
          ingredients[item - 1]
        ];
      }
    },
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const item = action.payload;
      if (item < state.ingredients.length - 1) {
        const ingredients = state.ingredients;
        [ingredients[item + 1], ingredients[item]] = [
          ingredients[item],
          ingredients[item + 1]
        ];
      }
    },
    clearConstructor: () => initialState
  },
  selectors: {
    bun: (state) => state.bun,
    ingredients: (state) => state.ingredients
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const selectorsBurgerConstructor = burgerConstructorSlice.selectors;
