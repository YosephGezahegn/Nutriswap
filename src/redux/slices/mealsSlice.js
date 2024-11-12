import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
  },
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
        calories: Number(meal.calories) || 0,
        protein: Number(meal.protein) || 0,
        carbs: Number(meal.carbs) || 0,
        fat: Number(meal.fat) || 0,
      });
      
      // Update weekly progress
      const today = new Date().getDay();
      const dayIndex = today === 0 ? 6 : today - 1; // Convert to 0-6 range where 0 is Monday
      
      // Calculate total calories for the day
      const totalCalories = Object.values(state.meals).flat().reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
      
      // Update the calories for today in weekly progress
      state.weeklyProgress[dayIndex].calories = totalCalories;
    },
    removeMeal: (state, action) => {
      const { mealType, mealId } = action.payload;
      if (state.meals[mealType]) {
        state.meals[mealType] = state.meals[mealType].filter((meal) => meal.id !== mealId);
        
        // Recalculate weekly progress
        const today = new Date().getDay();
        const dayIndex = today === 0 ? 6 : today - 1;
        
        const totalCalories = Object.values(state.meals).flat().reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);
        state.weeklyProgress[dayIndex].calories = totalCalories;
      }
    },
  },
});

export const { addMeal, removeMeal } = mealsSlice.actions;
export default mealsSlice.reducer;