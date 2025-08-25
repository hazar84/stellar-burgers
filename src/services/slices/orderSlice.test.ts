import { orderSlice, postOrderBurger, getOrderByNumber, resetCreatOrder } from './orderSlice';
import { TOrder } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api'; // мок через setupTests.ts

//Моковые данные
const mockOrder: TOrder = {
    _id: '643f3b7e481869001c4a2c1a',
    name: 'Краторный бургер',
    number: 12345,
    status: 'done',
    createdAt: '2023-04-18T12:00:00.000Z',
    updatedAt: '2023-04-18T12:05:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
};

//Настройка хранилища
const setupStore = () => {
    return configureStore({
    reducer: {
    order: orderSlice.reducer
    }
    });
};

//Тесты 
describe('Тест orderSlice', () => {
    let store: ReturnType<typeof setupStore>;

    beforeEach(() => {
    store = setupStore();
    jest.clearAllMocks();
    });

    //Тесты для postOrderBurger
    describe('Тест экшена postOrderBurger', () => {
        it('Должен установить orderRequest: true при pending', async () => {
            (orderBurgerApi as jest.MockedFunction<typeof orderBurgerApi>).mockResolvedValue({
            success: true,
            order: mockOrder,
            name: mockOrder.name,
            number: mockOrder.number
            } as any); // Обход типов — как в реальном API

            const promise = store.dispatch(postOrderBurger(['1', '2', '3']));
            const state = store.getState().order;

            expect(state.orderRequest).toBe(true);
            expect(state.errorOrderData).toBeNull();

            await promise;
        });

        it('Должен сохранить orderData и сбросить orderRequest при fulfilled', async () => {
            (orderBurgerApi as jest.MockedFunction<typeof orderBurgerApi>).mockResolvedValue({
            success: true,
            order: mockOrder
            } as any);

            await store.dispatch(postOrderBurger(['1', '2', '3']));

            const state = store.getState().order;

            expect(state.orderRequest).toBe(false);
            expect(state.orderData).toEqual(mockOrder);
            expect(state.errorOrderData).toBeNull();
        });

        it('Должен установить ошибку при rejected', async () => {
            const errorMessage = 'Ошибка создания заказа';
            (orderBurgerApi as jest.MockedFunction<typeof orderBurgerApi>).mockRejectedValue(
            new Error(errorMessage)
            );

            await store.dispatch(postOrderBurger(['1', '2', '3']));

            const state = store.getState().order;

            expect(state.orderRequest).toBe(false);
            expect(state.errorOrderData).toBe(errorMessage);
            expect(state.orderData).toBeNull();
            });
        });

    //Тесты для getOrderByNumber
    describe('Тест экшена getOrderByNumber', () => {
        it('Должен установить loadingOrderByNumber: true при pending', async () => {
            (getOrderByNumberApi as jest.MockedFunction<typeof getOrderByNumberApi>).mockResolvedValue({
            success: true,
            orders: mockOrder
            } as any);

            const promise = store.dispatch(getOrderByNumber(12345));
            const state = store.getState().order;

            expect(state.loadingOrderByNumber).toBe(true);
            expect(state.errorOrderByNumber).toBeNull();
            expect(state.orderRequest).toBe(true); // также устанавливается

            await promise;
        });

        it('Должен сохранить orderByNumber и сбросить loading при fulfilled', async () => {
            (getOrderByNumberApi as jest.MockedFunction<typeof getOrderByNumberApi>).mockResolvedValue({
            success: true,
            orders: [mockOrder]
            } as any);

            await store.dispatch(getOrderByNumber(12345));

            const state = store.getState().order;

            expect(state.loadingOrderByNumber).toBe(false);
            expect(state.orderByNumber).toEqual(mockOrder);
            expect(state.errorOrderByNumber).toBeNull();
            expect(state.orderRequest).toBe(false);
        });

        it('Должен установить ошибку при rejected', async () => {
            const errorMessage = 'Ошибка получения заказа';
            (getOrderByNumberApi as jest.MockedFunction<typeof getOrderByNumberApi>).mockRejectedValue(
            new Error(errorMessage)
            );

            await store.dispatch(getOrderByNumber(12345));

            const state = store.getState().order;

            expect(state.loadingOrderByNumber).toBe(false);
            expect(state.errorOrderByNumber).toBe(errorMessage);
            expect(state.orderByNumber).toBeNull();
            expect(state.orderRequest).toBe(false);
        });
    });

    //Тест для редьюсера
    describe('Тест редьюсера: resetCreatOrder', () => {
        it('Должен сбросить orderData', () => {
            // Сначала установим данные
            store.dispatch(postOrderBurger.fulfilled({
                order: mockOrder,
                success: false,
                name: ''
            }, '', ['1', '2']));

            let state = store.getState().order;
            expect(state.orderData).toEqual(mockOrder);

            // Вызовем action
            store.dispatch(resetCreatOrder());

            state = store.getState().order;
            expect(state.orderData).toBeNull();
        });
    });
});
