import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetData, PostData } from '../../services';

export const getProjectReport = createAsyncThunk(
  'report/all',
  async ({ projectId = '' }, thunkAPI) => {
    try {
      const res = await GetData(
        true,
        `/report/project-report?&projectId=${projectId}`
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

export const getDashboard = createAsyncThunk(
  'report/dashboard',
  async ({ formData }, thunkAPI) => {
    try {
      const res = await PostData(
        true,
        `/report/user-comparison-report`,
        formData
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

const reportSlice = createSlice({
  name: 'Report',
  initialState: {
    projectReport: [],
    userDashboard: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    isDashboardSuccess: false,
    message: '',
  },
  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.isDashboardSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProjectReport.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProjectReport.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.projectReport = payload;
    });
    builder.addCase(getProjectReport.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });

    builder.addCase(getDashboard.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getDashboard.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isDashboardSuccess = true;
      state.userDashboard = payload?.[0];
    });
    builder.addCase(getDashboard.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });
  },
});

export const { clearState } = reportSlice.actions;
export default reportSlice.reducer;
