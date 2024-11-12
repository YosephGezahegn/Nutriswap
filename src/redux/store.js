import { configureStore } from '@reduxjs/toolkit';

import mealsReducer from './slices/mealsSlice';
import foodSearchReducer from './slices/foodSearchSlice';
import mealFormReducer from './slices/mealFormSlice';
import navbarReducer from './slices/navbarSlice';
import swapReducer from './slices/swapSlice';
import authReducer from './slices/authSlice';
import suggestionsReducer from './slices/suggestionsSlice';
import recipeDetailReducer from './slices/recipeDetailSlice';

export const store = configureStore({
  reducer: {
    meals: mealsReducer,
    foodSearch: foodSearchReducer,
    mealForm: mealFormReducer,
    navbar: navbarReducer,
    swap: swapReducer,
    auth: authReducer,
    suggestions: suggestionsReducer,
    recipeDetail: recipeDetailReducer,
  },
});