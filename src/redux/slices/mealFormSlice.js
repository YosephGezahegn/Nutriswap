// redux/slices/mealFormSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    name: '',
    time: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    items: [],
  },
  showFoodSearch: false,
};

const mealFormSlice = createSlice({
  name: 'mealForm',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
    resetFormData: (state) => {
      state.formData = initialState.formData;
    },
    addFoodItem: (state, action) => {
      const newItem = action.payload;
      state.formData.items.push(newItem.name);
      state.formData.calories += newItem.calories;
      state.formData.protein += newItem.protein;
      state.formData.carbs += newItem.carbs;
      state.formData.fat += newItem.fat;
    },
    toggleFoodSearch: (state) => {
      state.showFoodSearch = !state.showFoodSearch;
    },
  },
});

export const { setFormData, resetFormData, addFoodItem, toggleFoodSearch } = mealFormSlice.actions;
export default mealFormSlice.reducer;