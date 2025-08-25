import { getIngredients, ingredientsSlice } from './ingredientsSlice';
import { TIngredient } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

const mockIngredients: TIngredient[] = [
    {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
    } as TIngredient,
    {
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        __v: 0
    } as TIngredient
];

const setupStore = () =>
configureStore({
    reducer: {
    ingredients: ingredientsSlice.reducer
    }
});

describe('Тест асинхронного экшена getIngredients', () => {
    let store: ReturnType<typeof setupStore>;

    beforeEach(() => {
        store = setupStore();
        jest.clearAllMocks();
    });

    it('Должен установить loading: true при pending', async () => {
        (getIngredientsApi as jest.MockedFunction<typeof getIngredientsApi>).mockResolvedValue(mockIngredients);

        const promise = store.dispatch(getIngredients());
        const state = store.getState().ingredients;

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();

        await promise;
    });

    it('Должен сохранить данные и установить loading: false при fulfilled', async () => {
        (getIngredientsApi as jest.MockedFunction<typeof getIngredientsApi>).mockResolvedValue(mockIngredients);

        await store.dispatch(getIngredients());

        const state = store.getState().ingredients;

        expect(state.loading).toBe(false);
        expect(state.ingredients).toEqual(mockIngredients);
        expect(state.error).toBeNull();
    });

    it('Должен установить ошибку и loading: false при rejected', async () => {
        const errorMessage = 'Ошибка сети';
        (getIngredientsApi as jest.MockedFunction<typeof getIngredientsApi>).mockRejectedValue(
        new Error(errorMessage)
        );

        await store.dispatch(getIngredients());

        const state = store.getState().ingredients;

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.ingredients).toEqual([]);
    });

    it('Должен использовать сообщение по умолчанию, если ошибка без payload', async () => {
        (getIngredientsApi as jest.MockedFunction<typeof getIngredientsApi>).mockRejectedValue(undefined);

        await store.dispatch(getIngredients());

        const state = store.getState().ingredients;

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Произошла ошибка');
        expect(state.ingredients).toEqual([]);
    });
});
