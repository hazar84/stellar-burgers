import { rootReducer } from './store';

// Моковые данные
const mockBun = {
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
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

describe('rootReducer', () => {
    it('должен корректно инициализировать начальное состояние всех слайсов', () => {
        const state = rootReducer(undefined, { type: 'INIT' });

        // burgerConstructor
        expect(state.burgerConstructor.bun).toBeNull();
        expect(state.burgerConstructor.ingredients).toEqual([]);

        // ingredients
        expect(state.ingredients.ingredients).toEqual([]);
        expect(state.ingredients.loading).toBe(false);
        expect(state.ingredients.error).toBeNull();

        // feed
        expect(state.feed.orders.orders).toEqual([]);
        expect(state.feed.orders.total).toBe(0);
        expect(state.feed.orders.totalToday).toBe(0);
        expect(state.feed.loading).toBe(false);
        expect(state.feed.error).toBeNull();

        // order
        expect(state.order.orderData).toBeNull();
        expect(state.order.errorOrderData).toBeNull();
        expect(state.order.orderRequest).toBe(false);
        expect(state.order.orderByNumber).toBeNull();
        expect(state.order.loadingOrderByNumber).toBe(false);
        expect(state.order.errorOrderByNumber).toBeNull();

        // user
        expect(state.user.dataUser).toBeNull();
        expect(state.user.isAuthChecked).toBe(false);
        expect(state.user.isAuthenticated).toBe(false);
        expect(state.user.loginUserError).toBeNull();

        // orders
        expect(state.orders.orders).toEqual([]);
        expect(state.orders.loading).toBe(false);
        expect(state.orders.error).toBeNull();
    });

    it('должен возвращать начальное состояние при неизвестном экшене', () => {
        const initialState = rootReducer(undefined, { type: 'INIT' });
        const unknownAction = { type: 'UNKNOWN_ACTION' };
        const newState = rootReducer(undefined, unknownAction);
        expect(newState).toEqual(initialState);
    });

    it('не должен изменять состояние при неизвестном экшене, если состояние определено', () => {
        // ingredients — массив объектов с id
        const existingState = {
            burgerConstructor: {
                bun: { ...mockBun, id: 'mock-bun-id' }, // id добавляется в конструкторе
                ingredients: [
                { ...mockIngredient, id: 'mock-ingredient-id-1' } // объект с id, а не строка
                ]
            },
            ingredients: {
                ingredients: [mockBun, mockIngredient],
                loading: false,
                error: null
            },
            feed: {
                orders: {
                orders: [
                    {
                    _id: '64b1a0a54816fe2c6f123456',
                    status: 'done',
                    name: 'Бургер с котлетой',
                    createdAt: '2023-07-15T12:00:00.000Z',
                    updatedAt: '2023-07-15T12:05:00.000Z',
                    number: 12345,
                    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
                    }
                ],
                total: 100,
                totalToday: 5
                },
                loading: false,
                error: null
            },
            order: {
                orderData: {
                _id: '64b1a0a54816fe2c6f123456',
                status: 'done',
                name: 'Бургер с котлетой',
                createdAt: '2023-07-15T12:00:00.000Z',
                updatedAt: '2023-07-15T12:05:00.000Z',
                number: 12345,
                ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
                },
                errorOrderData: null,
                orderRequest: false,
                orderByNumber: null,
                loadingOrderByNumber: false,
                errorOrderByNumber: null
            },
            user: {
                dataUser: { email: 'test@example.com', name: 'Test' },
                isAuthChecked: true,
                isAuthenticated: true,
                loginUserError: null
            },
            orders: {
                orders: [
                {
                    _id: '64b1a0a54816fe2c6f123456',
                    status: 'done',
                    name: 'Бургер с котлетой',
                    createdAt: '2023-07-15T12:00:00.000Z',
                    updatedAt: '2023-07-15T12:05:00.000Z',
                    number: 12345,
                    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
                }
                ],
                loading: false,
                error: null
            }
        };

        const unknownAction = { type: 'SOME_RANDOM_ACTION' };
        const newState = rootReducer(existingState, unknownAction);

        expect(newState).toBe(existingState); // ссылка не изменилась
        expect(newState).toEqual(existingState); // структура идентична
    });
});
