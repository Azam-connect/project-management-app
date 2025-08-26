import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DeleteData, GetData, PostData, PutData } from '../../services';

export const createProjcet = createAsyncThunk(
  'project/add',
  async (formData, thunkAPI) => {
    try {
      const res = await PostData(true, '/project/create', formData);
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

export const getAllProject = createAsyncThunk(
  'project/all',
  async ({ searchParam = '', currentPage = 1, pageSize = 25 }, thunkAPI) => {
    try {
      const res = await GetData(
        true,
        `/project/list?search=${searchParam}&currentPage=${currentPage}&pageSize=${pageSize}`
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

export const getAllAssignedProject = createAsyncThunk(
  'project/assigned-project',
  async ({ searchParam = '', currentPage = 1, pageSize = 25 }, thunkAPI) => {
    try {
      const res = await GetData(
        true,
        `/project/user-projects?search=${searchParam}&currentPage=${currentPage}&pageSize=${pageSize}`
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

export const updateProject = createAsyncThunk(
  'project/update',
  async ({ formData, id }, thunkAPI) => {
    try {
      const res = await PutData(true, `/project/update/${id}`, formData);
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
export const deleteProject = createAsyncThunk(
  'project/delete',
  async (id, thunkAPI) => {
    try {
      const res = await DeleteData(true, `/project/delete/${id}`);
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

const projectSlice = createSlice({
  name: 'Project',
  initialState: {
    pagination: {},
    project: [],
    assignedProject: [],
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
    builder.addCase(getAllProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllProject.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.project = payload.projects;
      state.message = payload?.message;
      state.pagination = payload?.pagination;
    });
    builder.addCase(getAllProject.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(getAllAssignedProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllAssignedProject.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.assignedProject = payload.projects;
      state.message = payload?.message;
      state.pagination = payload?.pagination;
    });
    builder.addCase(getAllAssignedProject.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(createProjcet.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createProjcet.fulfilled, (state, { payload }) => {
      state.isInsertSuccess = true;
      state.isLoading = false;
      state.message = payload?.message;
    });
    builder.addCase(createProjcet.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(updateProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProject.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isUpdateSuccess = true;
      state.message = payload?.message;
    });
    builder.addCase(updateProject.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(deleteProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.isDeleteSuccess = true;
      state.isLoading = false;
      state.message = action?.payload?.message;
      state.project = state.project.filter(
        (item) => item.id !== action?.meta?.arg
      );
    });
    builder.addCase(deleteProject.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });
  },
});

export const { clearState } = projectSlice.actions;
export default projectSlice.reducer;
