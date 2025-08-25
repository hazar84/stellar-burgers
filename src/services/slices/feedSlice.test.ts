import { feedSlice, getFeed } from './feedSlice';
import { TOrdersData } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api'; // мок через setupTests.ts

// --- Моковые данные ---
const mockFeedData: TOrdersData = {
    orders: [{
    _id: '643f3b7e481869001c4a2c1a',
    name: 'Краторный бургер',
    number: 12345,
    status: 'done',
    createdAt: '2023-04-18T12:00:00.000Z',
    updatedAt: '2023-04-18T12:05:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941', '643d69a5c3f7b9001cfa0942']
    }],
    total: 100,
    totalToday: 5
};

// --- Настройка хранилища ---
const setupStore = () => {
    return configureStore({
    reducer: {
    feed: feedSlice.reducer
    }
    });
};

// --- Тесты ---
describe('Тест асинхронного экшена getFeed', () => {
    let store: ReturnType<typeof setupStore>;

    beforeEach(() => {
    store = setupStore();
    jest.clearAllMocks();
    });

    it('Должен установить loading: true при pending', async () => {
        (getFeedsApi as jest.MockedFunction<typeof getFeedsApi>).mockResolvedValue(
        mockFeedData as unknown as { success: boolean; } & TOrdersData
        );

        // Диспатчим экшен
        const promise = store.dispatch(getFeed());

        // Проверяем состояние сразу после pending
        const state = store.getState().feed;
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();

        await promise;
    });

    it('Должен сохранить данные и установить loading: false при fulfilled', async () => {
        (getFeedsApi as jest.MockedFunction<typeof getFeedsApi>).mockResolvedValue(
        mockFeedData as unknown as { success: boolean; } & TOrdersData
        );

        await store.dispatch(getFeed());

        const state = store.getState().feed;

        expect(state.loading).toBe(false);
        expect(state.orders).toEqual(mockFeedData);
        expect(state.error).toBeNull();
    });

    it('Должен установить ошибку и loading: false при rejected', async () => {
        const errorMessage = 'Ошибка сети';
        (getFeedsApi as jest.MockedFunction<typeof getFeedsApi>).mockRejectedValue(
        new Error(errorMessage)
        );

        await store.dispatch(getFeed());

        const state = store.getState().feed;

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.orders).toEqual({
        orders: [],
        total: 0,
        totalToday: 0
        });
    });

    it('Должен использовать сообщение по умолчанию, если ошибка без payload', async () => {
        (getFeedsApi as jest.MockedFunction<typeof getFeedsApi>).mockRejectedValue(undefined);

        await store.dispatch(getFeed());

        const state = store.getState().feed;

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Произошла ошибка');
        expect(state.orders).toEqual({
        orders: [],
        total: 0,
        totalToday: 0
        });
    });
});
