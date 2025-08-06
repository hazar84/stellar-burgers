import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    { email, password }: Omit<TRegisterData, 'name'>,
    { rejectWithValue }
  ) => {
    try {
      const data = await loginUserApi({ email, password });
      if (!data?.success) {
        return rejectWithValue(data);
      }
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Неизвестная ошибка при авторизации');
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserApi();
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Ошибка загрузки данных пользователя'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Ошибка регистрации');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(user);
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Ошибка обновления данных'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.clear();
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Ошибка выхода');
    }
  }
);

type TUserState = {
  dataUser: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserError: string | null;
};

const initialState: TUserState = {
  dataUser: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserError: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.dataUser = null;
        state.isAuthenticated = false;
        state.loginUserError = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.dataUser = null;
        state.isAuthenticated = false;
        state.loginUserError = action.payload as string;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.dataUser = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.dataUser = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginUserError = action.payload as string;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.dataUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.loginUserError = action.payload as string;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.dataUser = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginUserError = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.dataUser = null;
        state.isAuthenticated = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginUserError = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.dataUser = action.payload.user;
        state.isAuthenticated = true;
      });
  },
  selectors: {
    isAuthenticated: (state) => state.isAuthenticated,
    isAuthChecked: (state) => state.isAuthChecked,
    dataUser: (state) => state.dataUser,
    userName: (state) => state.dataUser?.name
  }
});

export const { authChecked } = userSlice.actions;

export const selectorsUser = userSlice.selectors;
