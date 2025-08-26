import { combineReducers, configureStore } from '@reduxjs/toolkit';
import sessionStorage from 'redux-persist/lib/storage/session';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import authSlice from '../slices/auth/authSlice.js';
import userSlice from '../slices/user/userSlice.js';
import projectSlice from '../slices/project/projectSlice.js';
import taskSlice from '../slices/task/taskSlice.js';
import activitySlice from '../slices/activity-log/activityLogSlice.js';
import reportSlice from '../slices/report/reportSlice.js';

const reducers = combineReducers({
  auth: authSlice,
  user: userSlice,
  project: projectSlice,
  task: taskSlice,
  activity: activitySlice,
  report: reportSlice,
});

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.Mode !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export default store;
