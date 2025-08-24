import { userSlice, loginUser, registerUser, getUser, updateUser, logoutUser } from './userSlice';
import { TUser } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';
import { loginUserApi, registerUserApi, getUserApi, updateUserApi, logoutApi } from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

//Моковые данные
const mockUser: TUser = {
    name: 'Иван Иванов',
    email: 'ivan@example.com'
};

const mockLoginResponse = {
    success: true,
    user: mockUser,
    accessToken: 'fake-access-token',
    refreshToken: 'fake-refresh-token'
};

const mockRegisterData = {
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    password: '123456'
};

// --- Настройка хранилища ---
const setupStore = () => {
    return configureStore({
        reducer: {
        user: userSlice.reducer
        }
    });
};

//Тесты
describe('Тест userSlice', () => {
    let store: ReturnType<typeof setupStore>;

    beforeEach(() => {
        store = setupStore();
        jest.clearAllMocks();
    });

    //Тест экшена loginUser
    describe('Тест экшена loginUser', () => {
        it('Должен установить loginUserError: null при pending', async () => {
            (loginUserApi as jest.MockedFunction<typeof loginUserApi>).mockResolvedValue(
                mockLoginResponse as any
            );

            const promise = store.dispatch(loginUser({ email: 'a@a.ru', password: '123' }));
            const state = store.getState().user;

            expect(state.loginUserError).toBeNull();
            expect(state.dataUser).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isAuthChecked).toBe(false);

            await promise;
        });

        it('Должен сохранить пользователя, установить куки и флаги при fulfilled', async () => {
            (loginUserApi as jest.MockedFunction<typeof loginUserApi>).mockResolvedValue(
            mockLoginResponse as any
            );

            await store.dispatch(loginUser({ email: 'a@a.ru', password: '123' }));

            const state = store.getState().user;

            expect(state.dataUser).toEqual(mockUser);
            expect(state.isAuthenticated).toBe(true);
            expect(state.isAuthChecked).toBe(true);
            expect(state.loginUserError).toBeNull();

            expect(setCookie).toHaveBeenCalledWith('accessToken', 'fake-access-token');
            expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'fake-refresh-token');
        });

        it('Должен установить ошибку при rejected', async () => {
            const errorMessage = 'Неверный логин или пароль';
            (loginUserApi as jest.MockedFunction<typeof loginUserApi>).mockRejectedValue(
                new Error(errorMessage)
            );

            await store.dispatch(loginUser({ email: 'a@a.ru', password: '123' }));

            const state = store.getState().user;

            expect(state.dataUser).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isAuthChecked).toBe(true);
            expect(state.loginUserError).toBe(errorMessage);
        });

        it('Должен установить сообщение по умолчанию при пустой ошибке', async () => {
            (loginUserApi as jest.MockedFunction<typeof loginUserApi>).mockRejectedValue(undefined);

            await store.dispatch(loginUser({ email: 'a@a.ru', password: '123' }));

            const state = store.getState().user;

            expect(state.loginUserError).toBe('Неизвестная ошибка при авторизации');
        });
    });

    //Тест экшена registerUser
    describe('Тест экшена registerUser', () => {
        it('Должен сбросить данные при pending', async () => {
            (registerUserApi as jest.MockedFunction<typeof registerUserApi>).mockResolvedValue(
                mockLoginResponse as any
            );

            const promise = store.dispatch(registerUser(mockRegisterData));
            const state = store.getState().user;

            expect(state.dataUser).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.loginUserError).toBeNull();

            await promise;
        });

        it('Должен сохранить пользователя и установить флаги при fulfilled', async () => {
            (registerUserApi as jest.MockedFunction<typeof registerUserApi>).mockResolvedValue(
            mockLoginResponse as any
            );

            await store.dispatch(registerUser(mockRegisterData));

            const state = store.getState().user;

            expect(state.dataUser).toEqual(mockUser);
            expect(state.isAuthenticated).toBe(true);
            expect(state.loginUserError).toBeNull();

            expect(setCookie).toHaveBeenCalledWith('accessToken', 'fake-access-token');
            expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'fake-refresh-token');
        });

        it('Должен установить ошибку при rejected', async () => {
            const errorMessage = 'Пользователь уже существует';
            (registerUserApi as jest.MockedFunction<typeof registerUserApi>).mockRejectedValue(
                new Error(errorMessage)
            );

            await store.dispatch(registerUser(mockRegisterData));

            const state = store.getState().user;

            expect(state.isAuthenticated).toBe(false);
            expect(state.loginUserError).toBe(errorMessage);
        });
    });

    //Тест экшена getUser
    describe('Тест экшена getUser', () => {
        it('Должен сбросить данные при pending', async () => {
            (getUserApi as jest.MockedFunction<typeof getUserApi>).mockResolvedValue(
                mockLoginResponse as any
            );

            const promise = store.dispatch(getUser());
            const state = store.getState().user;

            expect(state.dataUser).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.loginUserError).toBeNull();

            await promise;
        });

        it('Должен сохранить пользователя и установить флаги при fulfilled', async () => {
            (getUserApi as jest.MockedFunction<typeof getUserApi>).mockResolvedValue(
                mockLoginResponse as any
            );

            await store.dispatch(getUser());

            const state = store.getState().user;

            expect(state.dataUser).toEqual(mockUser);
            expect(state.isAuthenticated).toBe(true);
            expect(state.isAuthChecked).toBe(true);
            expect(state.loginUserError).toBeNull();
        });

        it('Должен установить ошибку и isAuthChecked при rejected', async () => {
            const errorMessage = 'Ошибка сети';
            (getUserApi as jest.MockedFunction<typeof getUserApi>).mockRejectedValue(
                new Error(errorMessage)
            );

            await store.dispatch(getUser());

            const state = store.getState().user;

            expect(state.dataUser).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.loginUserError).toBe(errorMessage);
            expect(state.isAuthChecked).toBe(true);
        });
    });

    //Тест экшена updateUser
    describe('Тест экшена updateUser', () => {
        it('Должен установить isAuthenticated: true при pending', async () => {
            (updateUserApi as jest.MockedFunction<typeof updateUserApi>).mockResolvedValue(
                mockLoginResponse as any
            );

            const promise = store.dispatch(updateUser({ name: 'Новое имя' }));
            const state = store.getState().user;

            expect(state.isAuthenticated).toBe(true);
            expect(state.loginUserError).toBeNull();

            await promise;
        });

        it('Должен обновить пользователя при fulfilled', async () => {
            const updatedUser = { ...mockUser, name: 'Новое имя' };
            (updateUserApi as jest.MockedFunction<typeof updateUserApi>).mockResolvedValue({
                success: true,
                user: updatedUser
            } as any);

            await store.dispatch(updateUser({ name: 'Новое имя' }));

            const state = store.getState().user;

            expect(state.dataUser).toEqual(updatedUser);
            expect(state.isAuthenticated).toBe(true);
        });

        it('Должен установить ошибку при rejected', async () => {
            const errorMessage = 'Ошибка обновления';
            (updateUserApi as jest.MockedFunction<typeof updateUserApi>).mockRejectedValue(
                new Error(errorMessage)
            );

            await store.dispatch(updateUser({ name: 'Новое имя' }));

            const state = store.getState().user;

            expect(state.loginUserError).toBe(errorMessage);
        });
    });

    //Тест экшена logoutUser
    describe('Тест экшена logoutUser', () => {
        it('Должен установить isAuthenticated: true при pending', async () => {
            (logoutApi as jest.MockedFunction<typeof logoutApi>).mockResolvedValue({ success: true });

            const promise = store.dispatch(logoutUser());
            const state = store.getState().user;

            expect(state.isAuthenticated).toBe(true);

            await promise;
        });

        it('Должен очистить данные и localStorage при fulfilled', async () => {
            (logoutApi as jest.MockedFunction<typeof logoutApi>).mockResolvedValue({ success: true });

            await store.dispatch(logoutUser());

            const state = store.getState().user;

            expect(state.dataUser).toBeNull();
            expect(state.isAuthenticated).toBe(false);

            expect(deleteCookie).toHaveBeenCalledWith('accessToken');
            expect(localStorage.clear).toHaveBeenCalled();
        });

        it('Должен установить ошибку при rejected', async () => {
            const errorMessage = 'Ошибка выхода';
            (logoutApi as jest.MockedFunction<typeof logoutApi>).mockRejectedValue(
                new Error(errorMessage)
            );

            await store.dispatch(logoutUser());

            const state = store.getState().user;

            expect(state.isAuthenticated).toBe(false);
            expect(state.loginUserError).toBe(errorMessage);
        });
    });

    //Тест редьюсера: authChecked
    describe('Тест редьюсера: authChecked', () => {
        it('Должен установить isAuthChecked: true', () => {
        store.dispatch(userSlice.actions.authChecked());
        const state = store.getState().user;

        expect(state.isAuthChecked).toBe(true);
        });
    });
});
