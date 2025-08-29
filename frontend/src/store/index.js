
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import applicationsReducer from './slices/applicationsSlice';
import myApplicationsReducer from './slices/myapplicationslices';
import usersSliceReducer from './slices/usersSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
    myApplications: myApplicationsReducer,
    users: usersSliceReducer,  // ✅ now matches useSelector((state) => state.users)

  }
});
