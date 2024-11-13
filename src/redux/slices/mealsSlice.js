import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
  },
  bookmarkedMeals: [],
  weeklyProgress: [
    { day: 'Mon', calories: 2100 },
    { day: 'Tue', calories: 1950 },
    { day: 'Wed', calories: 2200 },
    { day: 'Thu', calories: 2000 },
    { day: 'Fri', calories: 1800 },
    { day: 'Sat', calories: 1900 },
    { day: 'Sun', calories: 2050 },
  ],
};

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    addMeal: (state, action) => {
      const { mealType, meal } = action.payload;
      if (!state.meals[mealType]) {
        state.meals[mealType] = [];
      }
      state.meals[mealType].push({
        ...meal,
        id: meal.id || Date.now(),
        recipeId: meal.recipeId || 'recipe_default',
        calories: Number(meal.calories) || 0,
        protein: Number(meal.protein) || 0,
        carbs: Number(meal.carbs) || 0,
        fat: Number(meal.fat) || 0,
      });
      
      const today = new Date().getDay();
      const dayIndex = today === 0 ? 6 : today - 1;
      const totalCalories = Object.values(state.meals).flat().reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
      state.weeklyProgress[dayIndex].calories = totalCalories;
    },
    removeMeal: (state, action) => {
      const { mealType, mealId } = action.payload;
      if (state.meals[mealType]) {
        state.meals[mealType] = state.meals[mealType].filter((meal) => meal.id !== mealId);
        
        const today = new Date().getDay();
        const dayIndex = today === 0 ? 6 : today - 1;
        const totalCalories = Object.values(state.meals).flat().reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);
        state.weeklyProgress[dayIndex].calories = totalCalories;
      }
    },
    toggleBookmark: (state, action) => {
      const meal = action.payload;
      const existingIndex = state.bookmarkedMeals.findIndex(m => m.id === meal.id);
      
      if (existingIndex >= 0) {
        state.bookmarkedMeals.splice(existingIndex, 1);
      } else {
        state.bookmarkedMeals.push(meal);
      }
    },
    addMealFromImage: (state, action) => {
      const { mealType, meal } = action.payload;
      if (!state.meals[mealType]) {
        state.meals[mealType] = [];
      }
      state.meals[mealType].push({
        ...meal,
        id: Date.now(),
        imageSource: 'camera',
      });
    },
  },
});

export const { addMeal, removeMeal, toggleBookmark, addMealFromImage } = mealsSlice.actions;
export default mealsSlice.reducer;