// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import dailyStatsReducer from './slices/dailyStatsSlice';
import mealsReducer from './slices/mealsSlice';
import foodSearchReducer from './slices/foodSearchSlice';
import mealFormReducer from './slices/mealFormSlice';
import navbarReducer from './slices/navbarSlice';
import swapReducer from './slices/swapSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    dailyStats: dailyStatsReducer,
    meals: mealsReducer,
    foodSearch: foodSearchReducer,
    mealForm: mealFormReducer,
    navbar: navbarReducer,
    swap: swapReducer,
    auth: authReducer,
  },
});