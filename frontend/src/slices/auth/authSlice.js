import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostData } from '../../services';

// Async Thunk for Login
export const AuthLogin = createAsyncThunk(
  'auth/login',
  async (formData, thunkAPI) => {
    try {
      const res = await PostData(false, '/user/login/', formData);
      if (res.status === 200) {
        return res.payload;
      } else {
        return thunkAPI.rejectWithValue('Invalid response');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || 'Login failed');
    }
  }
);

export const AuthLogout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const res = await PostData(true, '/logout/');
      if (res.status === 200) {
        sessionStorage.clear();
        return res.payload;
      } else {
        return thunkAPI.rejectWithValue('Logout failed');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || 'Logout error');
    }
  }
);

const storedAuth = sessionStorage.getItem('authentication');
const initialAuthData = storedAuth ? JSON.parse(storedAuth) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticate: !!initialAuthData,
    isAuthLoading: false,
    isAuthSuccess: false,
    isAuthError: false,
    isLogoutSuccess: false,
    authMessage: '',
    userInfo: initialAuthData?.user || {},
    token: initialAuthData?.access_token || '',
    refreshToken: initialAuthData?.refresh_token || '',
    userType: initialAuthData?.role || [],
  },
  reducers: {
    clearState: (state) => {
      state.isAuthLoading = false;
      state.isAuthSuccess = false;
      state.isAuthError = false;
      state.isLogoutSuccess = false;
      state.authMessage = '';
    },

    logout: (state) => {
      state.isAuthenticate = false;
      state.userInfo = {};
      state.token = '';
      state.refreshToken = '';
      state.userType = [];
      sessionStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AuthLogin.pending, (state) => {
        state.isAuthLoading = true;
        state.isAuthError = false;
        state.authMessage = '';
      })
      .addCase(AuthLogin.fulfilled, (state, { payload }) => {
        state.isAuthLoading = false;
        state.isAuthSuccess = true;

        state.isAuthenticate = true;
        state.userInfo = payload.user;
        state.token = payload.access_token;
        state.refreshToken = payload.refresh_token;
        state.userType = payload?.user?.role;
        state.authMessage = '';
        const { access_token, refresh_token, user } = payload;
        sessionStorage.setItem(
          'authentication',
          JSON.stringify({
            access_token,
            refresh_token,
            user,
          })
        );
      })
      .addCase(AuthLogin.rejected, (state, { payload }) => {
        state.isAuthLoading = false;
        state.isAuthError = true;
        state.isAuthenticate = false;
        state.authMessage = payload?.error;
      })
      .addCase(AuthLogout.pending, (state) => {
        state.isAuthLoading = true;
        state.isAuthError = false;
      })
      .addCase(AuthLogout.fulfilled, (state) => {
        state.isAuthLoading = false;
        state.isAuthenticate = false;
        state.isLogoutSuccess = true;
        state.userInfo = {};
        state.token = '';
        state.refreshToken = '';
        sessionStorage.clear();
      })
      .addCase(AuthLogout.rejected, (state, { payload }) => {
        state.isAuthLoading = false;
        state.isAuthError = true;
        state.isAuthenticate = false;
        state.userInfo = {};
        state.token = '';
        state.refreshToken = '';
        sessionStorage.clear();
        state.authMessage = payload?.error;
      });
  },
});

export const { clearState, chooseSchema, logout } = authSlice.actions;
export default authSlice.reducer;
