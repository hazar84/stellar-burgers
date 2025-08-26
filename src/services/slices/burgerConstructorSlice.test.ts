import { rootReducer } from '../store';
import { addIngredient } from './burgerConstructorSlice'

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

describe('burgerConstructorSlice', () => {
    describe('addIngredient', () => {
        it('должен добавить булку при добавлении ингредиента с типом "bun"', () => {
        const action = addIngredient(mockBun);
        const state = rootReducer(undefined, action);

        expect(state.burgerConstructor.bun).toEqual(
            expect.objectContaining({
            ...mockBun,
            id: 'test-id'
            })
        );
        expect(state.burgerConstructor.ingredients).toHaveLength(0);
    });

    it('должен добавить начинку в массив ingredients', () => {
        const action = addIngredient(mockIngredient);
        const state = rootReducer(undefined, action);

        expect(state.burgerConstructor.ingredients).toHaveLength(1);
        expect(state.burgerConstructor.ingredients[0]).toEqual(
            expect.objectContaining({
            ...mockIngredient,
            id: 'test-id'
            })
        );
        });
    });

    describe('removeIngredient', () => {
        it('должен удалить ингредиент по id', () => {
        const addIngredientAction = {
            type: 'burgerConstructor/addIngredient',
            payload: mockIngredient
        };
        const stateWithIngredient = rootReducer(undefined, addIngredientAction);

        const ingredientId = stateWithIngredient.burgerConstructor.ingredients[0].id;

        const removeAction = {
            type: 'burgerConstructor/removeIngredient',
            payload: { ...mockIngredient, id: ingredientId }
        };

        const stateAfterRemoval = rootReducer(stateWithIngredient, removeAction);

        expect(stateAfterRemoval.burgerConstructor.ingredients).toHaveLength(0);
        });
    });

    describe('moveUpIngredient', () => {
        it('должен переместить ингредиент вверх', () => {
        let state = rootReducer(undefined, {
            type: 'burgerConstructor/addIngredient',
            payload: mockIngredient
        });
        state = rootReducer(state, {
            type: 'burgerConstructor/addIngredient',
            payload: { ...mockIngredient, _id: '643d69a5c3f7b9001cfa0942' }
        });

        const moveUpAction = {
            type: 'burgerConstructor/moveUpIngredient',
            payload: 1
        };
        state = rootReducer(state, moveUpAction);

        expect(state.burgerConstructor.ingredients[0]._id).toBe('643d69a5c3f7b9001cfa0942');
        expect(state.burgerConstructor.ingredients[1]._id).toBe(mockIngredient._id);
    });

    it('не должен изменять порядок, если индекс 0', () => {
        let state = rootReducer(undefined, {
            type: 'burgerConstructor/addIngredient',
            payload: mockIngredient
        });
        state = rootReducer(state, {
            type: 'burgerConstructor/addIngredient',
            payload: { ...mockIngredient, _id: '643d69a5c3f7b9001cfa0942' }
        });

        const moveUpAction = {
            type: 'burgerConstructor/moveUpIngredient',
            payload: 0
        };
        const nextState = rootReducer(state, moveUpAction);

        expect(nextState.burgerConstructor.ingredients).toEqual(
            state.burgerConstructor.ingredients
        );
        });
    });

    describe('moveDownIngredient', () => {
        it('должен переместить ингредиент вниз', () => {
        let state = rootReducer(undefined, {
            type: 'burgerConstructor/addIngredient',
            payload: mockIngredient
        });
        state = rootReducer(state, {
            type: 'burgerConstructor/addIngredient',
            payload: { ...mockIngredient, _id: '643d69a5c3f7b9001cfa0942' }
        });

        const moveDownAction = {
            type: 'burgerConstructor/moveDownIngredient',
            payload: 0
        };
        state = rootReducer(state, moveDownAction);

        expect(state.burgerConstructor.ingredients[0]._id).toBe('643d69a5c3f7b9001cfa0942');
        expect(state.burgerConstructor.ingredients[1]._id).toBe(mockIngredient._id);
    });

    it('не должен изменять порядок, если индекс последний', () => {
        let state = rootReducer(undefined, {
            type: 'burgerConstructor/addIngredient',
            payload: mockIngredient
        });
        state = rootReducer(state, {
            type: 'burgerConstructor/addIngredient',
            payload: { ...mockIngredient, _id: '643d69a5c3f7b9001cfa0942' }
        });

        const moveDownAction = {
            type: 'burgerConstructor/moveDownIngredient',
            payload: 1
        };
        const nextState = rootReducer(state, moveDownAction);

        expect(nextState.burgerConstructor.ingredients).toEqual(
            state.burgerConstructor.ingredients
        );
        });
    });

    describe('clearConstructor', () => {
        it('должен сбросить состояние конструктора', () => {
        let state = rootReducer(undefined, {
            type: 'burgerConstructor/addIngredient',
            payload: mockBun
        });
        state = rootReducer(state, {
            type: 'burgerConstructor/addIngredient',
            payload: mockIngredient
        });

        expect(state.burgerConstructor.bun).not.toBeNull();
        expect(state.burgerConstructor.ingredients).toHaveLength(1);

        const clearAction = { type: 'burgerConstructor/clearConstructor' };
        state = rootReducer(state, clearAction);

        expect(state.burgerConstructor.bun).toBeNull();
        expect(state.burgerConstructor.ingredients).toEqual([]);
        });
    });
});
