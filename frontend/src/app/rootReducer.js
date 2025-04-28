import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import { authAPI } from '@/features/api/authAPI';
import { courseApi } from '@/features/api/courseAPI';
import {purchaseApi} from '@/features/api/purchaseAPI'
import { progressApi } from '@/features/api/progressAPI';
const rootReducer=combineReducers({
    [authAPI.reducerPath]:authAPI.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [purchaseApi.reducerPath] :purchaseApi.reducer,
    [progressApi.reducerPath] :progressApi.reducer,
    auth:authReducer
});
export default rootReducer;