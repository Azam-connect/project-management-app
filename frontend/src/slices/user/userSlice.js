import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DeleteData, GetData, PostData, PutData } from '../../services';

export const addUser = createAsyncThunk(
  'user/add',
  async (formData, thunkAPI) => {
    try {
      const res = await PostData(true, '/user/register/', formData);
      if (res.status === 201) {
        return res.payload;
      } else {
        return thunkAPI.rejectWithValue();
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllUser = createAsyncThunk(
  'user/all',
  async ({ searchParam = '', currentPage = 1, pageSize = 25 }, thunkAPI) => {
    try {
      const res = await GetData(
        true,
        `/user/profile-list?search=${searchParam}&currentPage=${currentPage}&pageSize=${pageSize}`
      );
      if (res.status === 200) {
        return res?.payload;
      } else {
        return thunkAPI.rejectWithValue();
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ formData, id }, thunkAPI) => {
    try {
      const res = await PutData(true, `/user/profile/${id}`, formData);
      if (res.status === 200) {
        return res.payload;
      } else {
        return thunkAPI.rejectWithValue();
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteUser = createAsyncThunk(
  'user/delete',
  async (id, thunkAPI) => {
    try {
      const res = await DeleteData(true, '/master/ArticleMaster/' + id + '/');
      if (res.status === 200) {
        return res.payload;
      } else {
        return thunkAPI.rejectWithValue();
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'User',
  initialState: {
    pagination: {},
    user: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    isInsertSuccess: false,
    isDeleteSuccess: false,
    isUpdateSuccess: false,
    message: '',
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.isInsertSuccess = false;
      state.isLoading = false;
      state.isUpdateSuccess = false;
      state.isDeleteSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = payload.users;
      state.message = payload?.message;
      state.pagination = payload?.pagination;
    });
    builder.addCase(getAllUser.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(addUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addUser.fulfilled, (state, { payload }) => {
      state.isInsertSuccess = true;
      state.isLoading = false;
      state.message = payload?.message;
    });
    builder.addCase(addUser.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isUpdateSuccess = true;
      state.message = payload?.message;
    });
    builder.addCase(updateUser.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isDeleteSuccess = true;
      state.isLoading = false;
      state.message = action?.payload?.message;
      state.user = state.user.filter((item) => item.id !== action?.meta?.arg);
    });
    builder.addCase(deleteUser.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });
  },
});

export const { clearState } = userSlice.actions;
export default userSlice.reducer;
