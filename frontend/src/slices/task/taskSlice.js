import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  DeleteData,
  GetData,
  PostDataMultipart,
  PutData,
  PutDataMultipart,
} from '../../services';

export const createTask = createAsyncThunk(
  'task/create',
  async (formData, thunkAPI) => {
    try {
      const res = await PostDataMultipart(true, '/task/add', formData);
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

export const getAllTasks = createAsyncThunk(
  'tasks/all',
  async (
    { id, status = '', searchParam = '', currentPage = 1, pageSize = 25 },
    thunkAPI
  ) => {
    try {
      let path = id ? `/task/list/${id}` : `/task/list`;
      const res = await GetData(
        true,
        `${path}?status=${status}&search=${searchParam}&currentPage=${currentPage}&pageSize=${pageSize}`
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

export const updateTask = createAsyncThunk(
  'task/update',
  async ({ formData, id }, thunkAPI) => {
    try {
      const res = await PutDataMultipart(true, `/task/modify/${id}`, formData);
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
export const deleteTask = createAsyncThunk(
  'task/delete',
  async (id, thunkAPI) => {
    try {
      const res = await DeleteData(true, `/task/purge/${id}`);
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

const taskSlice = createSlice({
  name: 'Task',
  initialState: {
    pagination: {},
    tasks: [],
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
    builder.addCase(getAllTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllTasks.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.tasks = payload?.data?.tasks;
      state.message = payload?.message;
      state.pagination = payload?.data?.pagination;
    });
    builder.addCase(getAllTasks.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(createTask.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createTask.fulfilled, (state, { payload }) => {
      state.isInsertSuccess = true;
      state.isLoading = false;
      state.message = payload?.message;
    });
    builder.addCase(createTask.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(updateTask.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateTask.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isUpdateSuccess = true;
      state.message = payload?.message;
    });
    builder.addCase(updateTask.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(deleteTask.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.isDeleteSuccess = true;
      state.isLoading = false;
      state.message = action?.payload?.message;
      state.tasks = state.tasks.filter((item) => item.id !== action?.meta?.arg);
    });
    builder.addCase(deleteTask.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });
  },
});

export const { clearState } = taskSlice.actions;
export default taskSlice.reducer;
