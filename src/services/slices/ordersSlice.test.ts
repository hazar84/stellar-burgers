import { ordersSlice, getOrders } from './ordersSlice';
import { TOrder } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';

//Моковый заказ
const mockOrder: TOrder = {
    _id: '643f3b7e481869001c4a2c1a',
    name: 'Краторный бургер',
    number: 12345,
    status: 'done',
    createdAt: '2023-04-18T12:00:00.000Z',
    updatedAt: '2023-04-18T12:05:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
};

//Мок ответа API
const mockApiResponse = {
    success: true,
    orders: mockOrder
};

//Настройка хранилища
const setupStore = () => {
    return configureStore({
    reducer: {
    orders: ordersSlice.reducer
    }
    });
};

//Тесты
describe('Тест ordersSlice', () => {
    let store: ReturnType<typeof setupStore>;

    beforeEach(() => {
    store = setupStore();
    jest.clearAllMocks();
    });

    describe('Тест экшена getOrders', () => {
        it('Должен установить loading: true при pending', async () => {
            (getOrdersApi as jest.MockedFunction<typeof getOrdersApi>).mockResolvedValue(
            mockApiResponse as any
            );

            const promise = store.dispatch(getOrders());
            const state = store.getState().orders;

            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
            expect(state.orders).toEqual([]); //Ожидаем пустой массив

            // Не ждём результата — это pending
            await promise;
        });

        it('Должен сохранить заказы и сбросить loading при fulfilled', async () => {
            (getOrdersApi as jest.MockedFunction<typeof getOrdersApi>).mockResolvedValue(
            mockApiResponse as any
            );

            await store.dispatch(getOrders());

            const state = store.getState().orders;

            expect(state.loading).toBe(false);
            expect(state.orders).toEqual(mockApiResponse); //Только здесь обновляется
            expect(state.error).toBeNull();
        });

        it('Должен установить ошибку и сбросить loading при rejected', async () => {
            const errorMessage = 'Ошибка сети';
            (getOrdersApi as jest.MockedFunction<typeof getOrdersApi>).mockRejectedValue(
            new Error(errorMessage)
            );

            await store.dispatch(getOrders());

            const state = store.getState().orders;

            expect(state.loading).toBe(false);
            expect(state.error).toBe(errorMessage);
            expect(state.orders).toEqual([]); //Остаётся пустым
        });

        it('Должен использовать сообщение по умолчанию при отсутствии ошибки', async () => {
            (getOrdersApi as jest.MockedFunction<typeof getOrdersApi>).mockRejectedValue(undefined);

            await store.dispatch(getOrders());

            const state = store.getState().orders;

            expect(state.loading).toBe(false);
            expect(state.error).toBe('Ошибка при загрузке заказов');
            expect(state.orders).toEqual([]); //Остаётся пустым
        });
    });
});
