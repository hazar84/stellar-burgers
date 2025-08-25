// Моки, которые применяются ко ВСЕМ тестам

const mockLocalStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
    writable: true,
    value: mockLocalStorage
});

jest.mock('@reduxjs/toolkit', () => ({
    ...jest.requireActual('@reduxjs/toolkit'),
    nanoid: () => 'test-id' // фиксированный ID
}));

jest.mock('@api', () => ({
    getIngredientsApi: jest.fn(),
    orderBurgerApi: jest.fn(),
    getFeedsApi: jest.fn(),
    getOrdersApi: jest.fn(),
    getOrderByNumberApi: jest.fn(),
    loginUserApi: jest.fn(),
    registerUserApi: jest.fn(),
    getUserApi: jest.fn(),
    updateUserApi: jest.fn(),
    logoutApi: jest.fn()
}));

jest.mock('./utils/cookie', () => ({
    setCookie: jest.fn(),
    deleteCookie: jest.fn()
}));