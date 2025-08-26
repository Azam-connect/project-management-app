import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetData } from '../../services';

export const getActivityLog = createAsyncThunk(
  'activity/all',
  async (
    { projectId = '', userId = '', currentPage = 1, pageSize = 25 },
    thunkAPI
  ) => {
    try {
      const res = await GetData(
        true,
        `/report/activity?userId=${userId}&projectId=${projectId}&currentPage=${currentPage}&pageSize=${pageSize}`
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

const activityLogSlice = createSlice({
  name: 'Activity Log',
  initialState: {
    pagination: {},
    activity: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getActivityLog.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getActivityLog.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.activity = payload.activities;
      state.message = payload?.message;
      state.pagination = payload?.pagination;
    });
    builder.addCase(getActivityLog.rejected, (state, { payload }) => {
      state.isError = true;
      state.isLoading = false;
      state.message = payload?.error;
    });
  },
});

export const { clearState } = activityLogSlice.actions;
export default activityLogSlice.reducer;
